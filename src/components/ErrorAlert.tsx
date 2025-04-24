import React from "react";

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  return (
    <div className="bg-red-100 text-red-800 border border-red-300 rounded-xl p-3">
      {message}
    </div>
  );
};

export default ErrorAlert;
