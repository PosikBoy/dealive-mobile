import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { TypeDispatch, TypeRootState } from '@/store/store';

export const useTypedDispatch = () => useDispatch<TypeDispatch>();
export const useTypedSelector: TypedUseSelectorHook<TypeRootState> = useSelector;
