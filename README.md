# react-native-keyboard-dodging-view

A react-native component for iOS that shifts the view up when the keyboard is presented. There are a few examples of this available including [KeyboardAvoidingView](https://facebook.github.io/react-native/releases/next/docs/keyboardavoidingview.html) but I've run into issues with this, particularly when using multiple fields. This solution aims to tackle this problem.

![demo](https://github.com/shaddeen/react-native-keyboard-dodging-view/blob/master/img/demo.gif)

##Setup

`npm install --save react-native-keyboard-dodging-view`

##Props

| Prop  | Type  |  |
|---|---|---|
| `verticalOffset`  | `number`  | (Optional) Additional vertical offset  |

##Usage

Import:
```
import KeyboardDodgingView from 'KeyboardDodgingView`
```
Example:
```
class Example extends Component {
  render() {
    return (
      <View style={{backgroundColor: '#dedede', flex: 1, paddingTop: 400}}>
        <KeyboardDodgingView>
          <TextInput returnKeyType="next" onSubmitEditing={() => this.refs.secondField.focus()} style={{height: 50, margin: 10, marginBottom: 0, backgroundColor: 'white'}} />
          <TextInput ref="secondField" returnKeyType="go" style={{height: 50, margin: 10, backgroundColor: 'white'}} />
        </KeyboardDodgingView>
      </View>
    );
  }
}
```

##Features
 - Dynamically calculates the height required to shift contents up
 - Accounts for changes in keyboard size
 - Handles multiple textfield selection

##Outstanding issues
 - Slight jump when switching text fields via the keyboard return key on iOS 8
 - Measurements are off when content is vertically aligned by a container view (with `justifyContent: 'center'`)
