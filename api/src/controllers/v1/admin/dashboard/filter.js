"use strict"

// ----------------------------------------FUNCTION------------------------------------------------

async function kycDashboardFilter(duration, match, model, status_count) {
    const model_count = [];
    let startDate, endDate;

    const isNotKycModel = model.modelName === 'User' || model.modelName === 'Transaction';

    const getKycStatusCounts = async (match, status_count, model) => {
        const statusKeys = Object.keys(status_count);

        const counts = await Promise.all(statusKeys.map(async (statusKey) => {
            model.modelName === 'User' ? match.kyc_status = status_count[statusKey]._id : match.status = status_count[statusKey]._id;
            const count = await model.countDocuments(match);
            return { [status_count[statusKey]._id]: count };
        }));

        return Object.assign({}, ...counts);
    };

    const performCount = async () => {
        if (isNotKycModel) {
            return getKycStatusCounts(match, status_count, model);
        } else {
            return model.countDocuments(match);
        }
    };

    const pushToModelCount = async (identifier) => {
        const countResult = await performCount();
        model_count.push({ _id: identifier, count: countResult });
    };

    const calculateDateRange = (startModifier, endModifier) => {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - startModifier);
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() - endModifier);
        endDate.setHours(23, 59, 59, 999);
    };
    const calculateWeekDateRange = (startModifier) => {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - startModifier);
        startDate.setHours(23, 59, 59, 999); // Set start time to 00:00:00

        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() - 6);
        endDate.setHours(0, 0, 0, 0); // Set end time to 23:59:59 on the last day of the week

    }
    const calculateMonthDateRange = (index) => {
        const currentDate = new Date();
        startDate = new Date(currentDate.getFullYear(), index, 1);
        endDate = new Date(currentDate.getFullYear(), index + 1, 0, 23, 59, 59, 999);

    };
    const calculateYearDateRange = (currentYear) => {
        startDate = new Date(currentYear, 0, 1);
        endDate = new Date(currentYear, 11, 31, 23, 59, 59, 999);

    };

    if (duration === 'daily') {
        const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
        const currentDate = new Date();

        await Promise.all(days.map(async (day) => {
            calculateDateRange((currentDate.getDay() + 6) % 7 + days.indexOf(day), 0);

            match.updated_at = {
                $gte: startDate,
                $lt: endDate,
            };

            await pushToModelCount(day);
        }));
    } else if (duration === 'weekly') {
        const weeks = [0, 7, 14, 21, 28, 35, 42];

        await Promise.all(weeks.map(async (week) => {
            calculateWeekDateRange(week);

            match.updated_at = {
                $gte: endDate,
                $lt: startDate,
            };
            await pushToModelCount(`${week + 7}d`);
        }));
    } else if (duration === 'monthly') {
        const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

        await Promise.all(months.map(async (month) => {
            calculateMonthDateRange(months.indexOf(month));

            match.updated_at = {
                $gte: startDate,
                $lt: endDate,
            };
            await pushToModelCount(month);
        }));
    } else if (duration === 'yearly') {
        const currentYear = new Date().getFullYear();

        await Promise.all(Array.from({ length: 7 }, (_, i) => i).map(async (yearIndex) => {
            const year = currentYear - yearIndex;
            calculateYearDateRange(year);

            match.updated_at = {
                $gte: startDate,
                $lt: endDate,
            };
            await pushToModelCount(year.toString());
        }));
    }

    return model_count;
}

async function dashboardFilters(model_count, duration, model, status, kind) {
    let startDate, endDate;
    if (duration === 'daily') {
        startDate = new Date() // Calculate the date for the desired day
        startDate.setHours(0, 0, 0, 0); // Set start time to 00:00:00

        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
    }
    else if (duration == 'weekly') {

        startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0); // Set start time to 00:00:00

        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
    }
    else if (duration == 'monthly') {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        startDate = new Date(startOfMonth);
        startDate.setHours(0, 0, 0, 0);

        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        endDate = new Date(endOfMonth);
        endDate.setHours(23, 59, 59, 999);
    }

    else if (duration == 'yearly') {
        const today = new Date();
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        startDate = new Date(startOfYear);
        startDate.setHours(0, 0, 0, 0);

        const endOfYear = new Date(today.getFullYear(), 12, 0);
        endDate = new Date(endOfYear);
        endDate.setHours(23, 59, 59, 999);
    }
    let statusCounts = await model.aggregate([
        {
            $match: {
                deleted_at: { $exists: false }, // Exclude deleted Orders
                ...(model.modelName === 'User' ? {
                    kyc_status: {
                        $in: status
                    }
                } :
                    {
                        status: {
                            $in: status
                        }
                    }),
                ...(duration == 'all_time' ? {} : {
                    updated_at: {
                        $gte: startDate,
                        $lt: endDate,
                    }
                }),
                ...(kind ? { kind } : {})
            },
        },
        {
            $group: {
                _id: (model.modelName === 'User' ? "$kyc_status" : "$status"),
                count: { $sum: 1 },
            },
        },
    ]);

    statusCounts.forEach((count) => {
        const found = model_count.find((entry) => entry._id === count._id);
        if (found) {
            found.count = count.count;
        }
    });

    const total_count = await model.countDocuments({
        deleted_at: {
            $exists: false,
        },
        ...(kind ? { kind } : {}),
        ...(duration === 'all_time' ? {} : {
            updated_at: {
                $gte: startDate,
                $lt: endDate,
            }
        }),
        ...(model.modelName === 'User' ? {
            kyc_status: {
                $in: status
            }
        } :
            {
                status: {
                    $in: status
                }
            }),
    });
    return {
        total_count,
        model_count
    }
}

// ---------------------------------EXPORTS------------------------------------------

module.exports = { kycDashboardFilter, dashboardFilters };