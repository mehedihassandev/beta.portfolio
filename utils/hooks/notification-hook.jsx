import React, {
  createContext,
  useCallback,
  useContext,
  useState
} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { iconHash } from '@utils/icon/icons';

const NotificationContext = createContext(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }

  return context;
};

export const NotificationProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState(false);

  const showNotification = useCallback(
    (newMessage, newSeverity) => {
      setMessage(newMessage);
      setSeverity(newSeverity);
      setOpen(true);
      setTimeout(() => setOpen(false), 5000); // Auto-hide after 5 seconds
    },
    []
  );

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      {open &&
        ReactDOM.createPortal(
          <div className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 w-full max-w-md text-white bg-transparent rounded-lg shadow-lg z-50">
            <div className={`flex gap-2 items-center ${severity ? 'bg-green-500' : 'bg-red-500'} px-7 py-5 rounded-lg`}>
              <div className="mr-4 text-xl">
                {severity ? iconHash.check : iconHash.cancel}
              </div>
              <span>{message}</span>
            </div>
          </div>,
          document.body
        )}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
