import { socketEvents, socketHelpers } from './SocketEvents';
import { toast } from 'react-toastify';

// Debug flag - set to true to enable detailed logging
const DEBUG = true;

// Debug logging function
const debugLog = (message, data = null) => {
  if (DEBUG) {
    if (data) {
      console.log(`[RideSocketHandler Debug] ${message}:`, data);
    } else {
      console.log(`[RideSocketHandler Debug] ${message}`);
    }
  }
};

// Error logging function
const errorLog = (message, error = null) => {
  if (error) {
    console.error(`[RideSocketHandler Error] ${message}:`, error);
    if (error.stack) {
      console.error(`[RideSocketHandler Error] Stack trace:`, error.stack);
    }
  } else {
    console.error(`[RideSocketHandler Error] ${message}`);
  }
};

class RideSocketHandler {
  constructor() {
    if (RideSocketHandler.instance) {
      return RideSocketHandler.instance;
    }
    this.unsubscribeFunctions = [];
    debugLog('RideSocketHandler instance created');
    RideSocketHandler.instance = this;
  }

  // Initialize socket event handlers
  initialize({
    setBookingRequestId,
    setBookingState,
    setDriverLocation,
    setDriverDetails,
    setRideStatus,
    setShowReviewPrompt,
    setShowDriverArrivedPrompt,
    setShowJourneyStartPrompt,
    setShowJourneyEndPrompt,
    setShowPaymentPrompt,
    setShowCancelPrompt,
    setShowNoDriverFoundPrompt,
    setShowDriverRejectedPrompt,
    setShowDriverAcceptedPrompt,
    setShowRequestSentPrompt,
    setShowScheduleRequestSentPrompt,
    setShowSocketSavedPrompt,
    setShowErrorPrompt,
  }) {
    debugLog('Initializing RideSocketHandler with state setters');

    // Store state setters
    this.stateSetters = {
      setBookingRequestId,
      setBookingState,
      setDriverDetails,
      setDriverLocation,
      setRideStatus,
      setShowCancelPrompt,
      setShowDriverAcceptedPrompt,
      setShowDriverArrivedPrompt,
      setShowDriverRejectedPrompt,
      setShowErrorPrompt,
      setShowJourneyEndPrompt,
      setShowJourneyStartPrompt,
      setShowNoDriverFoundPrompt,
      setShowPaymentPrompt,
      setShowRequestSentPrompt,
      setShowReviewPrompt,
      setShowScheduleRequestSentPrompt,
      setShowSocketSavedPrompt,
    };

    // Set up event handlers
    this.setupEventHandlers();
  }

  // Set up event handlers
  setupEventHandlers() {
    debugLog('Setting up event handlers');

    // Car locations handler
    this.unsubscribeFunctions.push(
      socketHelpers.onCarLocations(data => {
        debugLog('Received car locations', data);
        this.handleCarLocations(data);
      })
    );

    // Driver accepted handler
    this.unsubscribeFunctions.push(
      socketHelpers.onDriverAccepted(data => {
        debugLog('Driver accepted ride', data);
        this.handleDriverAccepted(data);
      })
    );

    // Driver rejected handler
    this.unsubscribeFunctions.push(
      socketHelpers.onDriverRejected(data => {
        debugLog('Driver rejected ride', data);
        this.handleDriverRejected(data);
      })
    );

    // Request sent handler
    this.unsubscribeFunctions.push(
      socketHelpers.onRequestSent(data => {
        debugLog('Request sent', data);
        this.handleRequestSent(data);
      })
    );

    // No driver found handler
    this.unsubscribeFunctions.push(
      socketHelpers.onNoDriverFound(data => {
        debugLog('No driver found', data);
        this.handleNoDriverFound(data);
      })
    );

    // Error handler
    this.unsubscribeFunctions.push(
      socketHelpers.onError(data => {
        debugLog('Socket error', data);
        this.handleError(data);
      })
    );

    // Schedule request sent handler
    this.unsubscribeFunctions.push(
      socketHelpers.onScheduleRequestSent(data => {
        debugLog('Schedule request sent', data);
        this.handleScheduleRequestSent(data);
      })
    );

    // Socket saved handler
    this.unsubscribeFunctions.push(
      socketHelpers.onSocketSaved(data => {
        debugLog('Socket saved', data);
        this.handleSocketSaved(data);
      })
    );
  }

  // Handle car locations
  handleCarLocations(data) {
    try {
      const { setDriverLocation } = this.stateSetters;
      if (data && data.locations) {
        setDriverLocation(data.locations);
      }
    } catch (error) {
      errorLog('Error handling car locations', error);
    }
  }

  // Handle driver accepted
  handleDriverAccepted(data) {
    try {
      const { setDriverDetails, setShowDriverAcceptedPrompt, setShowNoDriverFoundPrompt } =
        this.stateSetters;

      if (data && data.driver) {
        setDriverDetails(data.driver);
        setShowDriverAcceptedPrompt(true);
        setShowNoDriverFoundPrompt(false);
        toast.success('Driver accepted your ride request!');
      }
    } catch (error) {
      errorLog('Error handling driver accepted', error);
    }
  }

  // Handle driver rejected
  handleDriverRejected(data) {
    try {
      const { setShowDriverRejectedPrompt } = this.stateSetters;
      setShowDriverRejectedPrompt(true);
      toast.error('Driver rejected your ride request');
    } catch (error) {
      errorLog('Error handling driver rejected', error);
    }
  }

  // Handle request sent
  handleRequestSent(data) {
    try {
      const { setBookingRequestId, setShowRequestSentPrompt } = this.stateSetters;
      if (data && data.requestId) {
        setBookingRequestId(data.requestId);
        setShowRequestSentPrompt(true);
        toast.info('Ride request sent successfully');
      }
    } catch (error) {
      errorLog('Error handling request sent', error);
    }
  }

  // Handle no driver found
  handleNoDriverFound(data) {
    try {
      const { setShowNoDriverFoundPrompt } = this.stateSetters;
      setShowNoDriverFoundPrompt(true);
      toast.error('No drivers found in your area');
    } catch (error) {
      errorLog('Error handling no driver found', error);
    }
  }

  // Handle error
  handleError(data) {
    try {
      const { setShowErrorPrompt } = this.stateSetters;
      setShowErrorPrompt(true);
      toast.error(data.message || 'An error occurred');
    } catch (error) {
      errorLog('Error handling socket error', error);
    }
  }

  // Handle schedule request sent
  handleScheduleRequestSent(data) {
    try {
      const { setShowScheduleRequestSentPrompt } = this.stateSetters;
      setShowScheduleRequestSentPrompt(true);
      toast.info('Schedule request sent successfully');
    } catch (error) {
      errorLog('Error handling schedule request sent', error);
    }
  }

  // Handle socket saved
  handleSocketSaved(data) {
    try {
      const { setShowSocketSavedPrompt } = this.stateSetters;
      if (setShowSocketSavedPrompt && typeof setShowSocketSavedPrompt === 'function') {
        setShowSocketSavedPrompt(true);
      }
      toast.success('Socket connection established');
    } catch (error) {
      errorLog('Error handling socket saved', error);
    }
  }

  // Clean up event handlers
  cleanup() {
    debugLog('Cleaning up event handlers');
    this.unsubscribeFunctions.forEach(unsubscribe => {
      try {
        unsubscribe();
      } catch (error) {
        errorLog('Error unsubscribing from event', error);
      }
    });
    this.unsubscribeFunctions = [];
  }
}

// Create a singleton instance
const rideSocketHandler = new RideSocketHandler();

export default rideSocketHandler;
