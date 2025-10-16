import { useEffect } from 'react';

const PromptPassword = () => {
    useEffect(() => {
        const { ApperUI } = window.ApperSDK;
        ApperUI.showPromptPassword('#authentication-prompt-password');
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div id="authentication-prompt-password" className="bg-white mx-auto w-full max-w-md p-10 rounded-2xl shadow-xl"></div>
        </div>
    );
};

export default PromptPassword;