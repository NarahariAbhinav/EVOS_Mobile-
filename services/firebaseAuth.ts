import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import {
    Auth,
    ConfirmationResult,
    onAuthStateChanged,
    PhoneAuthProvider,
    signInWithPhoneNumber,
    signOut,
    User,
} from 'firebase/auth';
import { auth } from '../config/firebase'; // Import your initialized auth instance

/**
 * Sends an OTP code to the provided phone number.
 * @param phoneNumber The user's phone number (e.g., "+919876543210").
 * @param recaptchaVerifier A reference to the FirebaseRecaptchaVerifierModal component.
 * @returns A Promise that resolves with the confirmation result.
 */
export const sendOtp = async (
  phoneNumber: string,
  recaptchaVerifier: React.MutableRefObject<FirebaseRecaptchaVerifierModal | null>
): Promise<ConfirmationResult> => {
  try {
    const phoneProvider = new PhoneAuthProvider(auth as Auth);
    const confirmationResult = await signInWithPhoneNumber(
      auth as Auth,
      phoneNumber,
      recaptchaVerifier.current!
    );
    return confirmationResult;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error; // Re-throw the error to be handled by the UI
  }
};

/**
 * Verifies the OTP code entered by the user.
 * @param confirmationResult The confirmation result object received after sending the OTP.
 * @param otpCode The 6-digit OTP code from the user.
 * @returns A Promise that resolves with the user's credentials upon successful verification.
 */
export const verifyOtp = async (
  confirmationResult: ConfirmationResult,
  otpCode: string
) => {
  try {
    const result = await confirmationResult.confirm(otpCode);
    return result;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

/**
 * Signs out the currently logged-in user.
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Listens for changes in the user's authentication state.
 * @param callback A function to be called with the user object when the state changes.
 * @returns An unsubscribe function to stop listening.
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};