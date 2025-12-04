import {
	useEffect,
	useRef,
	useState,
	forwardRef,
	useImperativeHandle,
} from '@wordpress/element';
import EditorWrapper from './editor-wrapper';
import { useInstanceId } from '@wordpress/compose';

type ClassicEditorProps = {
	value: string;
	onChange: ( value: string ) => void;
	height?: number;
	useExtendStyles?: boolean;
	hasMedia?: boolean;
};

export interface ClassicEditorRef {
	insertContent: ( content: string ) => void;
	focus: () => void;
}

declare global {
	interface Window {
		wp: {
			editor: {
				initialize: ( id: string, settings: any ) => void;
				remove: ( id: string ) => void;
			};
		};
	}
}

const ClassicEditor: React.ForwardRefExoticComponent<
	ClassicEditorProps & React.RefAttributes< ClassicEditorRef >
> = forwardRef< ClassicEditorRef, ClassicEditorProps >(
	(
		{
			value,
			onChange,
			height = 250,
			useExtendStyles = false,
			hasMedia = true,
		},
		ref
	) => {
	const [ isEditorReady, setIsEditorReady ] = useState( false );
	const editorRef = useRef< any >( null );
	const quicktagsClickHandlerRef = useRef< ( () => void ) | null >( null );

		const editorId = useInstanceId( ClassicEditor, 'wpmvc-classic-editor' );

		const hasWpEditor = !! window.wp?.editor;

	const setupEditor = ( editor: any ) => {
		editorRef.current = editor;

		editor.on( 'init', () => {
			editor.setContent( value );
		} );

		// Handle Visual tab changes
		editor.on( 'change', () => {
			onChange( editor.getContent() );
		} );

		setIsEditorReady( true );
	};

	const handleTextAreaChange = () => {
		const textarea = document.getElementById( editorId ) as HTMLTextAreaElement;
		if ( textarea ) {
			onChange( textarea.value );
		}
	};

		// Expose editor methods to parent component
		useImperativeHandle(
			ref,
			() => ( {
				insertContent: ( content: string ) => {
					if ( editorRef.current ) {
						editorRef.current.insertContent( content );
					}
				},
				focus: () => {
					if ( editorRef.current ) {
						editorRef.current.focus();
					}
				},
			} ),
			[ editorRef.current ]
		);

	const initEditor = () => {
		window.wp.editor.remove( editorId );

		window.wp.editor.initialize( editorId, {
			tinymce: {
				height,
				toolbar1:
					'formatselect,table,bold,italic,bullist,numlist,link,blockquote,alignleft,aligncenter,alignright,underline,strikethrough,forecolor,removeformat,codeformat,outdent,indent,undo,redo',
				menubar: false,
				setup: setupEditor,
			},
			quicktags: true,
			mediaButtons: hasMedia,
		} );

		// Add event listeners for Text/Code tab (textarea)
		const textarea = document.getElementById( editorId ) as HTMLTextAreaElement;
		if ( textarea ) {
			// Listen to input for typing
			textarea.addEventListener( 'input', handleTextAreaChange );
			// Listen to change for toolbar button clicks (quicktags)
			textarea.addEventListener( 'change', handleTextAreaChange );
			// Listen to keyup as a fallback
			textarea.addEventListener( 'keyup', handleTextAreaChange );
		}

		// Listen to quicktags toolbar button clicks
		setTimeout( () => {
			const quicktagsToolbar = document.getElementById( `qt_${ editorId }_toolbar` );
			if ( quicktagsToolbar ) {
				const quicktagsHandler = () => {
					// Use setTimeout to ensure textarea value is updated after button action
					setTimeout( handleTextAreaChange, 50 );
				};
				quicktagsClickHandlerRef.current = quicktagsHandler;
				quicktagsToolbar.addEventListener( 'click', quicktagsHandler );
			}
		}, 100 );
	};

		useEffect( () => {
			if (
				editorRef.current &&
				value !== editorRef.current.getContent()
			) {
				editorRef.current.setContent( value );
			}
		}, [ value ] );

		useEffect( () => {
			if ( isEditorReady ) {
				setTimeout( () => {
					editorRef.current.setContent( value );
				}, 500 );
			}
		}, [ isEditorReady ] );

	useEffect( () => {
		if ( hasWpEditor ) {
			initEditor();
		}

		return () => {
			if ( hasWpEditor ) {
				// Remove textarea event listeners
				const textarea = document.getElementById( editorId ) as HTMLTextAreaElement;
				if ( textarea ) {
					textarea.removeEventListener( 'input', handleTextAreaChange );
					textarea.removeEventListener( 'change', handleTextAreaChange );
					textarea.removeEventListener( 'keyup', handleTextAreaChange );
				}

				// Remove quicktags toolbar click listener
				const quicktagsToolbar = document.getElementById( `qt_${ editorId }_toolbar` );
				if ( quicktagsToolbar && quicktagsClickHandlerRef.current ) {
					quicktagsToolbar.removeEventListener( 'click', quicktagsClickHandlerRef.current );
				}
				
				window.wp.editor.remove( editorId );
			}
		};
	}, [ hasWpEditor ] );

	return (
			<EditorWrapper $extend={ useExtendStyles }>
				<textarea className="wpmvc-classic-editor" id={ editorId } />
			</EditorWrapper>
		);
	}
);

export default ClassicEditor;
