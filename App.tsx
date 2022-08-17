import React, {useState} from 'react';
import {SafeAreaView, Text, Button, View, StyleSheet} from 'react-native';

import ElementsExample from './Elements';
import FuturePaymentsExample from './FuturePayments';
import PaymentSheetExample from './PaymentSheet';
import PaymentSheetSubscriptionExample from './PaymentSheetSubscription';
import {API_URL} from './Constants';

type Mode =
  | 'PaymentSheet'
  | 'FuturePayments'
  | 'Elements'
  | 'PaymentSheetSubscription'
  | null;

const App = () => {
  const [key, setKey] = React.useState('');
  const [mode, setMode] = useState<Mode>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${API_URL}/stripe-key`);
        const {publishableKey} = await response.json();
        setKey(publishableKey);
      } catch (e) {
        throw new Error(
          'Unable to fetch publishable key. Is your server running?',
        );
      }
    })();
  });

  switch (mode) {
    case 'Elements':
      return (
        <ElementsExample
          publishableKey={key}
          goBack={() => {
            setMode(null);
          }}
        />
      );
    case 'FuturePayments':
      return (
        <FuturePaymentsExample
          publishableKey={key}
          goBack={() => {
            setMode(null);
          }}
        />
      );
    case 'PaymentSheet':
      return (
        <PaymentSheetExample
          publishableKey={key}
          goBack={() => {
            setMode(null);
          }}
        />
      );
    case 'PaymentSheetSubscription':
      return (
        <PaymentSheetSubscriptionExample
          publishableKey={key}
          goBack={() => {
            setMode(null);
          }}
        />
      );
    default:
      return (
        <SafeAreaView style={styles.container}>
          <Text style={styles.center}>
            Welcome to the React Native Video Series example app! Check out some
            of the examples below:
          </Text>
          <View style={styles.buttonsContainer}>
            <Button
              title="Payment Sheet example"
              onPress={() => {
                setMode('PaymentSheet');
              }}
            />
            <Button
              title="Payment Sheet Subscription example"
              onPress={() => {
                setMode('PaymentSheetSubscription');
              }}
            />
            <Button
              title="Future Payments example"
              onPress={() => {
                setMode('FuturePayments');
              }}
            />
            <Button
              title="Elements example"
              onPress={() => {
                setMode('Elements');
              }}
            />
          </View>
        </SafeAreaView>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'space-around',
    width: '80%',
  },
  center: {textAlign: 'center'},
  buttonsContainer: {
    alignSelf: 'center',
    justifyContent: 'space-around',
    width: '80%',
    height: '50%',
  },
});

export default App;
