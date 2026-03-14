import React, { useEffect, useImperativeHandle, useRef } from 'react';
import {
  Control,
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  useController,
} from 'react-hook-form';
import { KeyboardTypeOptions, StyleSheet, TextInput, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { fonts } from '@/constants/styles';
import { useTheme } from '@/hooks/useTheme';

export interface IInputField<TFieldValues extends FieldValues = FieldValues> {
  type?: 'default' | 'password';
  placeholder: string;
  error?: FieldError;
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  keyboardType?: KeyboardTypeOptions;
  handler?: (value: string) => string;
}

export const InputField = <TFieldValues extends FieldValues = FieldValues>(
  props: IInputField<TFieldValues>,
) => {
  const { colors } = useTheme();
  const {
    type = 'default',
    placeholder,
    name,
    control,
    rules = {},
    keyboardType = 'default',
    handler = value => value,
  } = props;

  const { field } = useController<TFieldValues>({
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
  const inputColor = useSharedValue(colors.inputBorder);

  const raisePlaceholder = () => {
    placeholderTop.value = withTiming(-9, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
  };

  const downPlaceholder = () => {
    placeholderTop.value = withTiming(11, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
  };

  const makeInputColorFocused = () => {
    inputColor.value = withTiming(colors.primary, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
  };

  const makeInputColorUnFocused = () => {
    inputColor.value = withTiming(colors.inputBorder, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
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

  const animatedPlaceholderPosition = useAnimatedStyle(() => {
    return {
      top: placeholderTop.value,
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

  useImperativeHandle(field.ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
  }));

  const inputRef = useRef<TextInput>(null);

  const handleChange = (value: string) => {
    const newValue = handler(value);
    field.onChange(newValue);
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
          value={field.value ?? ''}
          keyboardType={keyboardType}
          onFocus={handleFocus}
          onChangeText={handleChange}
          onBlur={handleBlur}
        />
      </Animated.View>

      <Animated.View style={[styles.placeholderContainer, animatedPlaceholderPosition]}>
        <Animated.Text
          style={[
            styles.placeholder,
            { backgroundColor: colors.background },
            animatedPlaceholderColor,
          ]}
          onPress={() => inputRef.current.focus()}
        >
          {placeholder}
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

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
    paddingLeft: 15,
    paddingVertical: 11,
  },
  placeholderContainer: {
    position: 'absolute',
    left: 12,
  },
  placeholder: {
    fontSize: 14,
    fontFamily: fonts.regular,
  },
});
