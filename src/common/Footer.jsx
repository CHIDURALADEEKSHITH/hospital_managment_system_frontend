import "./common.css";

const Footer = () => {

    return (
        <footer className="common-footer">

            <div>
                © {new Date().getFullYear()} Hospital Management System
            </div>

            <div>
                Secure Healthcare Management
            </div>

        </footer>
    );
};

export default Footer;