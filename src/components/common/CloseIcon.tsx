
import IconX from '@assets/svgs/IconX'
import { useAppSelector } from '@store/index';
import { themeSelector } from '@store/reducers/theme.reducer';
import React = require('react')

const CloseIcon = () => {
    const current = useAppSelector((state) => themeSelector(state, "current"));
    return <IconX color={current.textColor} />
}
export default CloseIcon