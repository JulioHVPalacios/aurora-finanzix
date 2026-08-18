/* ==========================================================================
   VALO OS - BIOMETRICS SECURITY (WebAuthn / Passkeys)
   Local-only implementation for Fingerprint and FaceID
   ========================================================================== */

import { storage } from './storage.js';

// Convert Uint8Array to Base64 string
function bufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let str = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return window.btoa(str);
}

// Convert Base64 string to Uint8Array
function base64ToBuffer(base64) {
  const str = window.atob(base64);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }
  return bytes;
}

export const biometrics = {
  /**
   * Check if the device has a platform authenticator (Fingerprint, FaceID, Windows Hello)
   */
  async isAvailable() {
    if (!window.PublicKeyCredential) return false;
    try {
      return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch (e) {
      return false;
    }
  },

  /**
   * Register a local passkey (Fingerprint/FaceID) to unlock the app
   */
  async register() {
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const userId = new Uint8Array(16);
      window.crypto.getRandomValues(userId);

      const options = {
        publicKey: {
          challenge: challenge,
          rp: {
            name: "VALO OS",
            id: window.location.hostname
          },
          user: {
            id: userId,
            name: "usuario@valo",
            displayName: "Usuario VALO"
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" }, // ES256
            { alg: -257, type: "public-key" } // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required"
          },
          timeout: 60000,
          attestation: "none"
        }
      };

      const credential = await navigator.credentials.create(options);
      
      if (credential) {
        const credentialIdBase64 = bufferToBase64(credential.rawId);
        storage.updateSettings({ biometricId: credentialIdBase64, biometricEnabled: true });
        return true;
      }
      return false;
    } catch (e) {
      console.warn("Error registering biometrics:", e);
      return false;
    }
  },

  /**
   * Request native Fingerprint/FaceID prompt to unlock
   */
  async verify() {
    try {
      const settings = storage.getSettings() || {};
      if (!settings.biometricEnabled || !settings.biometricId) return false;

      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const credentialId = base64ToBuffer(settings.biometricId);

      const options = {
        publicKey: {
          challenge: challenge,
          allowCredentials: [{
            id: credentialId,
            type: "public-key",
            transports: ["internal"]
          }],
          userVerification: "required",
          timeout: 60000
        }
      };

      const assertion = await navigator.credentials.get(options);
      return !!assertion; // Returns true if the user successfully scanned their fingerprint
    } catch (e) {
      console.warn("Error verifying biometrics:", e);
      return false; // User canceled or fingerprint failed
    }
  }
};
