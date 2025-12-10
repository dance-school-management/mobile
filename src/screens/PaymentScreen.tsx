import React, { useState } from 'react';
import { Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';


export default function PaymentScreen() {
    return (
        <Modal
            visible={true}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={() => {}}
        >
            <SafeAreaView className="flex-1">
                <WebView
                    source={{ uri: 'https://checkout.stripe.com/c/pay/cs_test_a1QhKmEllYngQh1Zf6ttZAXo9jFa3u5hWUGqyTaRSD1H2oyEZqBsliV93T#fidnandhYHdWcXxpYCc%2FJ2FgY2RwaXEnKSdkdWxOYHwnPyd1blpxYHZxWjA0VkNNcEpMaWdTQ25LVlZCZmptbzJISWZvQlJtRGpRPUN%2FXEhsXW9dZlV0Y0pWTERPbGg3XDFRMGhpY0hQNWg3cXBjNXU9RHBsS01mblB9VEBiZFJKMWJzNTU3VEBRT3c0fycpJ2N3amhWYHdzYHcnP3F3cGApJ2dkZm5id2pwa2FGamlqdyc%2FJyZjY2NjY2MnKSdpZHxqcHFRfHVgJz8ndmxrYmlgWmxxYGgnKSdga2RnaWBVaWRmYG1qaWFgd3YnP3F3cGB4JSUl' }}
                    className="flex-1"
                />
            </SafeAreaView>
        </Modal>
    )
}