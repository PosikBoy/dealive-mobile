import React, { FC, useEffect, useImperativeHandle, useRef } from 'react';
import { Control, useController } from 'react-hook-form';
import { StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { colors } from '@/constants/colors';
import { fonts } from '@/constants/styles';
import { useTheme } from '@/hooks/useTheme';

export interface DataInputFieldRef {
  focus: () => void;
}

interface IControllerField {
  name: string;
  control: Control<any>;
  error?: any;
  placeholder: string;
  keyboardType?: string;
  handler: (value: string) => void;
  rules?: any;
}
const InputFieldWithHandler: FC<IControllerField> = props => {
  const { colors } = useTheme();
  const { name, control, error, placeholder, handler, rules = {} } = props;

  const { field } = useController({
    control,
    name,
    rules,
  });

  const changeHandler = (value: string) => {
    const newValue = handler(value);
    field.onChange(newValue);
  };

  const placeholderTop = useSharedValue(11);
  const inputColor = useSharedValue(colors.inputPlaceholder);

  const raisePlaceholder = () => {
    placeholderTop.value = withTiming(-9);
  };

  const downPlaceholder = () => {
    placeholderTop.value = withTiming(11);
  };

  const makeInputColorFocused = () => {
    inputColor.value = withTiming(colors.primary);
  };

  const makeInputColorUnfocused = () => {
    inputColor.value = withTiming(colors.inputBorder);
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
    makeInputColorUnfocused();
  };

  const handleFocus = () => {
    raisePlaceholder();
    makeInputColorFocused();
  };

  const inputRef = useRef<TextInput>(null);

  useImperativeHandle(field.ref, () => {
    return {
      focus: () => {
        inputRef.current.focus();
      },
    };
  });

  useEffect(() => {
    if (field.value) {
      raisePlaceholder();
    }
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.inputContainer, animatedBorderColor, { backgroundColor: colors.background }]}
      >
        <TextInput
          placeholder=''
          ref={inputRef}
          style={[styles.input, { color: colors.text }]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={changeHandler}
          value={field.value}
        />
      </Animated.View>

      <Animated.View style={[styles.placeholderContainer, animatedPlaceholderPosition]}>
        <TouchableWithoutFeedback onPress={() => inputRef.current.focus()}>
          <Animated.Text
            style={[
              styles.placeholder,
              { backgroundColor: colors.background },
              animatedPlaceholderColor,
            ]}
          >
            {placeholder + '*'}
          </Animated.Text>
        </TouchableWithoutFeedback>
      </Animated.View>
      {error && <ThemedText color='error'>{error?.message}</ThemedText>}
    </View>
  );
};

export default InputFieldWithHandler;

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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 8,
  },
  input: {
    width: '100%',
    height: '100%',
    color: colors.black,
    fontSize: 14,
    fontFamily: fonts.regular,
    paddingLeft: 15,
    paddingVertical: 11,
  },
  placeholderContainer: {
    position: 'absolute',
    left: 12,
    backgroundColor: colors.white,
  },
  placeholder: {
    fontFamily: fonts.medium,
    fontSize: 14,
  },
});
