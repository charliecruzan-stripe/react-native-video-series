import {StripeProvider, usePaymentSheet} from '@stripe/stripe-react-native';
import React, {useEffect, useState} from 'react';
import {Button, Image, Text, View, Alert, StyleSheet} from 'react-native';
import {MERCHANT_ID, API_URL} from './Constants';

const FuturePayments = ({
  goBack,
  publishableKey,
}: {
  goBack: () => void;
  publishableKey: string;
}) => {
  const [ready, setReady] = useState(false);
  const {initPaymentSheet, presentPaymentSheet, loading} = usePaymentSheet();

  useEffect(() => {
    Alert.alert(
      'Please read!',
      'In order for this example to work, you must edit `server/index.js` and set a valid value for the PRICE_ID constant.',
    );
    initialisePaymentSheet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialisePaymentSheet = async () => {
    const {setupIntent, ephemeralKey, customer} =
      await fetchPaymentSheetParams();

    const {error} = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      setupIntentClientSecret: setupIntent,
      merchantDisplayName: 'Example Inc.',
      applePay: {
        merchantCountryCode: 'US',
      },
      googlePay: {
        merchantCountryCode: 'US',
        testEnv: true,
        currencyCode: 'usd',
      },
      allowsDelayedPaymentMethods: true,
      returnURL: 'stripe-example://stripe-redirect',
    });
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      setReady(true);
    }
  };

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${API_URL}/payment-sheet-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const {setupIntent, ephemeralKey, customer} = await response.json();

    return {
      setupIntent,
      ephemeralKey,
      customer,
    };
  };

  async function buy() {
    const {error} = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'The subscription was setup successfully');
      setReady(false);
    }
  }

  return (
    <View style={styles.container}>
      <StripeProvider
        publishableKey={publishableKey}
        merchantIdentifier={MERCHANT_ID}>
        <Text>1 kg of Sweet Potatoes</Text>
        <Image source={require('./potato.jpeg')} style={styles.image} />
        <Button
          title={'Subscribe to monthly delivery'}
          onPress={buy}
          disabled={loading || !ready}
        />
        <Button title={'Go back'} onPress={goBack} />
      </StripeProvider>
    </View>
  );
};

export default FuturePayments;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 100,
  },
  image: {
    height: 250,
    width: 250,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
  },
});
