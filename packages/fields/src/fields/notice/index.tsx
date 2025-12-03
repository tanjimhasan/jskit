/**
 * External dependencies
 */
import { Notice as NoticeComponent } from '@shamim-ahmed/components';
import { NoticeFieldProps } from './types';

export default function Notice( { field }: NoticeFieldProps ): JSX.Element {
	const { status, notice, isDismissible, onRemove } = field;

	return (
		<NoticeComponent
			status={ status }
			isDismissible={ isDismissible }
			onRemove={ onRemove }
		>
			{ notice }
		</NoticeComponent>
	);
}
