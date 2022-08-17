import React from 'react';
import {Button, Image, Text, View, Alert, StyleSheet} from 'react-native';
import {
  StripeProvider,
  useConfirmPayment,
  CardField,
  CardForm,
} from '@stripe/stripe-react-native';

import {API_URL, MERCHANT_ID} from './Constants';

const Elements = ({
  goBack,
  publishableKey,
}: {
  goBack: () => void;
  publishableKey: string;
}) => {
  const [isReady, setIsReady] = React.useState(false);
  const {confirmPayment, loading} = useConfirmPayment();

  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(`${API_URL}/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currency: 'usd',
      }),
    });
    const {clientSecret} = await response.json();
    return clientSecret;
  };

  const buy = async () => {
    const clientSecret = await fetchPaymentIntentClientSecret();

    const {error, paymentIntent} = await confirmPayment(clientSecret, {
      paymentMethodType: 'Card',
    });

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.localizedMessage);
    } else if (paymentIntent) {
      Alert.alert(
        'Success',
        `The payment was confirmed successfully! currency: ${paymentIntent.currency}`,
      );
    }
  };

  return (
    <View style={styles.container}>
      <StripeProvider
        publishableKey={publishableKey}
        merchantIdentifier={MERCHANT_ID}>
        <Text>1 kg of Sweet Potatoes</Text>
        <Image source={require('./potato.jpeg')} style={styles.image} />
        <CardField
          style={styles.cardField}
          placeholders={{number: '4242 for testing'}}
          onCardChange={details => {
            if (details.complete) {
              setIsReady(true);
            }
          }}
        />
        {/* <CardForm style={styles.cardForm} /> */}
        <View style={styles.buttons}>
          <Button title={'Go back'} onPress={goBack} />
          <Button title={'Buy'} onPress={buy} disabled={loading || !isReady} />
        </View>
      </StripeProvider>
    </View>
  );
};

export default Elements;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 250,
    width: 250,
  },
  cardField: {
    height: 35,
    width: '90%',
    marginBottom: 20,
  },
  cardForm: {
    height: 270,
    width: '80%',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
  },
});
