import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';

interface RazorpayWebViewProps {
  orderId: string;
  amount: number; // in paise
  keyId: string;
  serviceName: string;
  phone: string;
  onSuccess: (paymentData: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  onDismiss: () => void;
}

export const RazorpayWebView: React.FC<RazorpayWebViewProps> = ({
  orderId, amount, keyId, serviceName, phone, onSuccess, onDismiss
}) => {
  const [loading, setLoading] = useState(true);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
</head>
<body style="background:#0F766E;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
  <p style="color:white;font-family:sans-serif;">Opening payment...</p>
  <script>
    window.onload = function() {
      var options = {
        key: '${keyId}',
        amount: '${amount}',
        currency: 'INR',
        name: 'Gokul Healthcare',
        description: '${serviceName}',
        order_id: '${orderId}',
        prefill: { contact: '${phone}' },
        theme: { color: '#0F766E' },
        handler: function(response) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SUCCESS', data: response }));
        },
        modal: {
          ondismiss: function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'DISMISS' }));
          }
        }
      };
      var rzp = new Razorpay(options);
      rzp.on('payment.failed', function(response) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'FAIL', data: response.error }));
      });
      rzp.open();
    };
  </script>
</body>
</html>`;

  const handleMessage = (event: any) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'SUCCESS') {
        onSuccess(msg.data);
      } else {
        onDismiss();
      }
    } catch {
      onDismiss();
    }
  };

  return (
    <Modal visible animationType="slide" onRequestClose={onDismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Secure Payment</Text>
          <TouchableOpacity onPress={onDismiss} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
        {loading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#0F766E" />
            <Text style={styles.loaderText}>Opening Razorpay...</Text>
          </View>
        )}
        <WebView
          source={{ html }}
          onMessage={handleMessage}
          onLoadEnd={() => setLoading(false)}
          javaScriptEnabled
          domStorageEnabled
          style={{ flex: 1 }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
    backgroundColor: '#fff',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  closeBtn: { padding: 8 },
  closeText: { fontSize: 18, color: '#64748B' },
  loaderOverlay: {
    position: 'absolute', top: 60, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', zIndex: 10,
  },
  loaderText: { marginTop: 12, color: '#64748B' },
});
