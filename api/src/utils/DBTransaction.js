"use strict";

const { startSession } = require("mongoose");

class DBTransaction {
  /**
   * Initialize a new Database Transaction
   *
   * @param {import("mongodb").ClientSession} session
   */
  constructor(session) {
    this.session = session;

    session.startTransaction();
  }

  /**
   * Commit all the changes in transaction
   *
   * @param {boolean=} endSession
   * @returns {Promise<void>}
   */
  async commit(endSession = true) {
    const { session } = this;

    await session.commitTransaction();

    if (endSession) session.endSession();
  }

  /**
   * Abort all the changes in transaction
   *
   * @param {boolean=} endSession
   * @returns {Promise<void>}
   */
  async abort(endSession = true) {
    const { session } = this;

    await session.abortTransaction();

    if (endSession) session.endSession();
  }

  /**
   * Get mongoose options
   *
   * @returns {{session: import("mongodb").ClientSession}}
   */
  mongoose() {
    return { session: this.session };
  }
}

/**
 * Initialize a new Database Transaction
 *
 * @param {import("mongodb").SessionOptions=} options
 * @returns {Promise<DBTransaction>}
 */
DBTransaction.init = async function init(options = undefined) {
  const session = await startSession(options);

  return new this(session);
};

module.exports = DBTransaction;
