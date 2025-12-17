/**
 * WordPress dependencies
 */
import { Slider as SliderComponent } from '@shamim-ahmed/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Label from '../../components/label';
import { getValue, isDisabled, updateAttribute } from '../../utils';
import { SliderFieldProps } from './types';
import { isFunction } from 'lodash';

const Slider = ( props: SliderFieldProps ) => {
	const { field, attributes } = props;

	// Check if min/max are functions and execute them if they are
    const min = isFunction( field?.min ) ? field.min( attributes ) : field?.min;
    const max = isFunction( field?.max ) ? field.max( attributes ) : field?.max;

	return (
		<SliderComponent
			//@ts-ignore
			label={ <Label { ...props } /> }
			max={ max }
			min={ min }
			value={ getValue( props ) }
			onChange={ ( value: any ) => updateAttribute( value, props ) }
			disabled={ isDisabled( props ) }
			required={ field?.required }
			unit={ field.unit }
			customUnits={ field.customUnits }
			description={ field.description }
		/>
	);
};

export default Slider;
