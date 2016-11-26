/**
 * @providesModule KeyboardDodgingView
 * https://github.com/shaddeen/react-native-keyboard-dodging-view
 * @flow
 */

import React from 'react';

import {
  View,
  Keyboard,
  TextInput,
  LayoutAnimation,
  UIManager,
  Platform
} from 'react-native';

class KeyboardDodgingView extends React.Component {
  static propTypes = {
    ...View.propTypes,
    verticalOffset: React.PropTypes.number
  };

  static defaultProps = {
    verticalOffset: 0
  };

  constructor () {
    super();

    this.state = {
      top: 0
    };
  }

  componentWillMount () {
    if (Platform.OS == 'ios') {
      this._subscriptions = [
        Keyboard.addListener('keyboardWillChangeFrame', (event) => this.onKeyboardChange(event)),
        Keyboard.addListener('keyboardWillShow', (event) => this.onKeyboardWillShow(event)),
        Keyboard.addListener('keyboardWillHide', (event) => this.onKeyboardWillHide(event))
      ];
    }
  }

  componentWillUnmount () {
    Platform.OS == 'ios' && this._subscriptions.forEach((subscription) => subscription.remove());
  }

  onKeyboardWillShow (event) {
    this._keyboardVisible = true;
    this.onKeyboardChange(event);
  }

  onKeyboardWillHide (event) {
    this._keyboardVisible = false;
    this._keyboardHeight = 0;
    this.onKeyboardChange(event);
  }

  onKeyboardChange (event) {
    let top = 0;

    if (!event || !this._frame) {
      this.setState({top});
      return;
    }

    const {duration, easing, startCoordinates, endCoordinates} = event;
    const viewHeight = this._frame.height;
    const viewTopOffset = this._frame.y;

    /// Testing
    const { State: TextInputState } = TextInput;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();

    // if (currentlyFocusedField) {
    //   UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
    //     console.log(originX, originY, width, height, pageX, pageY);
    //     if (pageY < 0) {
    //       console.log("Field was hidden!")
    //       this.setState({top});
    //       this._keyboardVisible = false;
    //       this._keyboardHeight = 0;
    //       return;
    //     }
    //   });
    // }
    if (currentlyFocusedField) {
      UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
        console.log(originX, originY, width, height, pageX, pageY);

        console.log("keyboardHeight:" + this._keyboardHeight)
        if (pageY < 250) { //this._keyboardHeight) {
          this.setState({top});
          this._keyboardVisible = false;
          this._keyboardHeight = 0;
          return;
        }

        if (this._keyboardHeight === endCoordinates.height) {
          return;
        }

        if (this._keyboardHeight !== endCoordinates.height || startCoordinates.screenY > endCoordinates.screenY) {
          if (endCoordinates.screenY - viewHeight < viewTopOffset) {
            top = endCoordinates.screenY - viewTopOffset - viewHeight - this.props.verticalOffset;
          }
        }

        this.animateLayout(duration, easing);
        this.setState({top});
        if (this._keyboardVisible) {
          this._keyboardHeight = endCoordinates.height;
        }
      });
    }
    else {
      // TODO: put this in a method!!  
      console.log("Measure not")
        if (this._keyboardHeight === endCoordinates.height) {
          return;
        }

        if (this._keyboardHeight !== endCoordinates.height || startCoordinates.screenY > endCoordinates.screenY) {
          if (endCoordinates.screenY - viewHeight < viewTopOffset) {
            top = endCoordinates.screenY - viewTopOffset - viewHeight - this.props.verticalOffset;
          }
        }

        this.animateLayout(duration, easing);
        this.setState({top});
        if (this._keyboardVisible) {
          this._keyboardHeight = endCoordinates.height;
        }
    }
        /// 

  }


  animateLayout (duration = 250, easing = 'keyboard') {
    LayoutAnimation.configureNext({
      duration: duration,
      update: {
        duration: duration,
        type: LayoutAnimation.Types[easing]
      }
    });
  }  

  onLayout (event) {
    if (event && event.nativeEvent.layout !== this._frame) {
      this._frame = event.nativeEvent.layout;
      this.props.onLayout && this.props.onLayout(event);
    }
  }

  render () {
    const {style, ...props} = this.props;
    return (
      <View style={[style, {marginTop: this.state.top}]} {...props} onLayout={(event) => this.onLayout(event)} />
    );
  }
}

module.exports = KeyboardDodgingView;
