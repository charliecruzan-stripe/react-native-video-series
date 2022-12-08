import {StripeProvider, usePaymentSheet} from '@stripe/stripe-react-native';
import React, {useEffect, useState} from 'react';
import {Button, Image, Text, View, Alert, StyleSheet} from 'react-native';
import {MERCHANT_ID, API_URL} from './Constants';

const PaymentSheet = ({
  goBack,
  publishableKey,
}: {
  goBack: () => void;
  publishableKey: string;
}) => {
  const [ready, setReady] = useState(false);
  const {
    initPaymentSheet,
    presentPaymentSheet,
    loading,
    resetPaymentSheetCustomer,
  } = usePaymentSheet();

  useEffect(() => {
    initialisePaymentSheet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialisePaymentSheet = async () => {
    const {paymentIntent} = await fetchPaymentSheetParams();

    const {error} = await initPaymentSheet({
      appearance: {
        colors: {
          primary: '#e06c75',
          background: '#282c34',
          componentBackground: '#abb2bf',
          componentDivider: '#e5c07b',
          primaryText: '#61afef',
          secondaryText: '#c678dd',
          componentText: '#282c34',
          icon: '#e06c75',
          placeholderText: '#ffffff',
        },
        shapes: {
          borderRadius: 25,
        },
      },
      paymentIntentClientSecret: paymentIntent,
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
    const response = await fetch(`${API_URL}/payment-sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const {paymentIntent, ephemeralKey, customer} = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  async function buy() {
    const {error} = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'The payment was confirmed successfully');
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

        <View style={styles.buttons}>
          <Button title={'Go back'} onPress={goBack} />
          <Button title={'Buy'} onPress={buy} disabled={loading || !ready} />
        </View>
        <Button
          title={'Logout'}
          onPress={async () => {
            await resetPaymentSheetCustomer();
          }}
        />
      </StripeProvider>
    </View>
  );
};

export default PaymentSheet;

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
