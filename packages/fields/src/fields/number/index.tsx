/**
 * External dependencies
 */
import { Number as NumberComponent } from '@shamim-ahmed/components';

/**
 * Internal dependencies
 */
import Label from '../../components/label';
import { getValue, isDisabled, updateAttribute } from '../../utils';
import { NumberFieldProps } from './types';
import { isFunction } from 'lodash';

export default function Number( props: NumberFieldProps ): JSX.Element {
	const { field, attributes, setAttributes } = props;

	const handleChange = ( value: any ) => {
		let processedValue;
		if ( field.precision ) {
			processedValue = value ? parseFloat( value ) : undefined;
		}else{
			const integerValue = parseInt( value, 10 );
            processedValue = !isNaN( integerValue ) ? integerValue : undefined;
		}
		updateAttribute( processedValue, props );

		// Execute the custom onChange handler if defined
		if (field.onChange && typeof field.onChange === 'function') {
			field.onChange({value: processedValue, ...props});
		}
	};

	const min = isFunction( field?.min ) ? field.min( attributes ) : field?.min;
	const max = isFunction( field?.max ) ? field.max( attributes ) : field?.max;

	return (
		<NumberComponent
			//@ts-ignore
			label={ <Label { ...props } /> }
			description={ field.description }
			size="__unstable-large"
			step={ 1 }
			value={ getValue( props ) }
			onChange={ handleChange }
			disabled={ isDisabled( props ) }
			min={ min }
			max={ max }
			required={ field?.required }
			labelPosition={ field?.labelPosition }
		/>
	);
}
