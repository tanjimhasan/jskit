import type { Field as FieldType } from '@wordpress/dataviews';
import { __ } from '@wordpress/i18n';

export type Column = Omit< FieldType< any >, 'enableGlobalSearch' | 'sort' >;
export type TableType = {
	items: object;
	total: number;
	isLoading: boolean;
	fields: Array< Column >;
	refresh: ( params: any ) => void;
	actions?: object;
	queryParams: {
		search: string;
		page: number;
		perPage: number;
		sort: object;
	};
};
