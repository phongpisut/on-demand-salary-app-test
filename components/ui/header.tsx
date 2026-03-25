import React from 'react';
import { View, AnimatePresence } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from './text';

type HeaderProps = {
  title: string;
  visible: boolean;
};

export default function Header(props: HeaderProps) {
  const paddingTop = useSafeAreaInsets().top;
  return (
    <AnimatePresence>
      {props.visible && (
        <View
          from={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: paddingTop + 40 }}
          exit={{ opacity: 0 }}
          exitTransition={{
            type: 'spring',
            duration: 100,
          }}
          style={{ paddingTop, height: paddingTop + 40 }}
          className="absolute top-0 right-0 left-0 z-10 w-full items-center bg-white shadow-md">
          <Text className="text-xl font-semibold">{props.title}</Text>
        </View>
      )}
    </AnimatePresence>
  );
}
