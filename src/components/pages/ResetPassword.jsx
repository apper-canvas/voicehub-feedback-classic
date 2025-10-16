import { useEffect } from 'react';

const ResetPassword = () => {
    useEffect(() => {
        const { ApperUI } = window.ApperSDK;
        ApperUI.showResetPassword('#authentication-reset-password');
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div id="authentication-reset-password" className="bg-white mx-auto w-full max-w-md p-10 rounded-2xl shadow-xl"></div>
        </div>
    );
};

export default ResetPassword;