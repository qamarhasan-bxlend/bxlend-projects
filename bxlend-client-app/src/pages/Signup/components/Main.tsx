import Image from 'react-bootstrap/Image';

const Main = () => {
  return (
    <div className="row justify-content-between signup-container">
      <div className="signup-main-part col-lg-6 col-12 d-flex align-items-center flex-column">
        <div className="signup-title mb-5">Welcome to BxLend!</div>
        <div className="signup-button-group d-flex flex-column position-relative ps-lg-5">
          <button type="button" className="btn btn-secondary signup-next-btn my-2">
            Sign up with phone or email
          </button>
          <div className="d-flex my-4 align-items-center">
            <hr className="hr" />
            <div className="px-3">Or</div>
            <hr className="hr" />
          </div>
          <button type="button" className="btn btn-outline-secondary signup-google-btn my-2">
            Google account
          </button>
        </div>
        <div className="d-flex align-items-center ps-5">
          <div className="signup-login-text">Already registered? </div>
          <button type="button" className="btn btn-link signup-login-btn my-2">
            Login
          </button>
        </div>
      </div>
      <div className="signup-main-picture col-lg-6 col-12 d-lg-flex d-none justify-content-center align-items-center">
        <Image src="./assets/ellipse-green.png" width="37rem" className="d-lg-flex d-none" />
        <Image src="./assets/ellipse-green.png" width="37rem" className="d-lg-none d-flex" />
      </div>
      <div className="signup-absolute-background d-lg-none d-flex justify-content-center align-items-center">
        <Image src="./assets/ellipse-green.png" width="37rem" />
      </div>
    </div>
  );
};

export default Main;
