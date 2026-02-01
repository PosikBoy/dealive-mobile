import React, { FC, useEffect, useImperativeHandle, useRef } from 'react';
import { Control, useController } from 'react-hook-form';
import {
  KeyboardTypeOptions,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { fonts } from '@/constants/styles';
import { useTheme } from '@/hooks/useTheme';

interface IField {
  type?: 'default' | 'password';
  placeholder: string;
  error?: any;
  name: string;
  control: Control<any>;
  rules?: any;
  keyboardType?: KeyboardTypeOptions;
}
const InputField: FC<IField> = props => {
  const { colors } = useTheme();
  const {
    type = 'default',
    placeholder,
    name,
    control,
    rules = {},
    keyboardType = 'default',
  } = props;

  const { field } = useController({
    control,
    name,
    rules,
  });

  useEffect(() => {
    if (field.value) {
      raisePlaceholder();
    }
  });
  const placeholderTop = useSharedValue(11);
  const inputColor = useSharedValue(colors.inputPlaceholder);

  const raisePlaceholder = () => {
    placeholderTop.value = withTiming(-9);
  };
  const downPlaceholder = () => {
    placeholderTop.value = withTiming(11);
  };
  const makeInputColorFocused = () => {
    inputColor.value = withSpring(colors.primary);
  };
  const makeInputColorUnFocused = () => {
    inputColor.value = withSpring(colors.inputBorder);
  };
  const animatedBorderColor = useAnimatedStyle(() => {
    return {
      borderColor: inputColor.value,
    };
  });
  const animatedPlaceholderColor = useAnimatedStyle(() => {
    return {
      color: inputColor.value,
    };
  });
  const handleBlur = () => {
    if (!field.value) {
      downPlaceholder();
    }
    makeInputColorUnFocused();
  };

  const handleFocus = () => {
    raisePlaceholder();
    makeInputColorFocused();
  };

  useImperativeHandle(field.ref, () => {
    return {
      focus: () => {
        inputRef.current.focus();
      },
    };
  });

  const inputRef = useRef<TextInput>(null);

  const handleChange = e => {
    field.onChange(e);
  };
  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.inputContainer, { backgroundColor: colors.background }, animatedBorderColor]}
      >
        <TextInput
          placeholder=''
          ref={inputRef}
          secureTextEntry={type === 'password'}
          style={[styles.input, { color: colors.text }]}
          value={field.value}
          keyboardType={keyboardType}
          onFocus={handleFocus}
          onChangeText={handleChange}
          onBlur={handleBlur}
        />
      </Animated.View>

      <Animated.View
        style={{
          position: 'absolute',
          top: placeholderTop,
          left: 12,
          backgroundColor: colors.background,
          paddingHorizontal: 5,
        }}
      >
        <TouchableWithoutFeedback onPress={() => inputRef.current.focus()}>
          <Animated.Text style={[styles.placeholder, animatedPlaceholderColor]}>
            {placeholder}
          </Animated.Text>
        </TouchableWithoutFeedback>
      </Animated.View>
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    width: '100%',
    height: 60,
  },
  inputContainer: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
  },
  input: {
    width: '100%',
    height: '100%',
    fontFamily: fonts.regular,
    paddingLeft: 12,
    paddingVertical: 11,
  },
  placeholder: {
    fontSize: 14,
    fontFamily: fonts.regular,
  },
});
