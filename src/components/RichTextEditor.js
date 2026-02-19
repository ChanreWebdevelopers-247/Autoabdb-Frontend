import React, { useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Editor to avoid SSR issues
const Editor = dynamic(() => import('@tinymce/tinymce-react').then(mod => mod.Editor), { 
  ssr: false 
});

const RichTextEditor = ({ value, onChange, placeholder = 'Enter content...', error = false }) => {
  const editorRef = useRef(null);

  const handleEditorChange = (content, editor) => {
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <div className="rich-text-editor-wrapper">
      <div className={`${error ? 'border-red-300' : 'border-gray-300'} border-2 rounded-lg overflow-hidden`}>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || '05unsiucqi3ucax3t722ccc7b2byxe6jz8dah3x7ave30sa9'}
          onInit={(evt, editor) => editorRef.current = editor}
          value={value || ''}
          onEditorChange={handleEditorChange}
          init={{
            height: 500,
            menubar: true,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'help', 'wordcount',
              'emoticons', 'codesample', 'directionality', 'pagebreak',
              'nonbreaking', 'quickbars'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic underline strikethrough | forecolor backcolor | ' +
              'alignleft aligncenter alignright alignjustify | ' +
              'bullist numlist outdent indent | ' +
              'removeformat | link image media table | code fullscreen | help',
            content_style: `
              body { 
                font-family: Helvetica, Arial, sans-serif; 
                font-size: 16px;
                margin: 1rem;
              }
              table {
                border-collapse: collapse;
                max-width: 80%;
                width: 100%;
                margin: 1rem auto;
                border: 1px solid #e5e7eb;
                border-radius: 0.5rem;
                overflow: hidden;
              }
              table td,
              table th {
                border: 1px solid #e5e7eb;
                padding: 0.75rem 1rem;
                text-align: left;
                min-width: 50px;
              }
              table th {
                background-color: #f3f4f6;
                font-weight: 600;
                color: #111827;
              }
              table tr:nth-child(even) {
                background-color: #f9fafb;
              }
              table tr:hover {
                background-color: #f3f4f6;
              }
              table caption {
                font-weight: 600;
                margin-bottom: 0.5rem;
                text-align: left;
              }
            `,
            placeholder: placeholder,
            branding: false,
            promotion: false,
            resize: true,
            image_advtab: true,
            image_caption: true,
            image_title: true,
            link_title: true,
            link_target_list: [
              { title: 'None', value: '' },
              { title: 'New window', value: '_blank' }
            ],
            table_default_attributes: {
              border: '1',
              cellpadding: '8',
              cellspacing: '0'
            },
            table_default_styles: {
              'border-collapse': 'collapse',
              'max-width': '80%',
              'width': '100%',
              'margin': '0 auto',
              'border': '1px solid #e5e7eb'
            },
            table_class_list: [
              { title: 'None', value: '' },
              { title: 'Striped', value: 'table-striped' },
              { title: 'Bordered', value: 'table-bordered' }
            ],
            table_cell_class_list: [
              { title: 'None', value: '' },
              { title: 'Header', value: 'table-header' }
            ],
            table_row_class_list: [
              { title: 'None', value: '' },
              { title: 'Alternate', value: 'table-row-alt' }
            ],
            table_use_colgroups: true,
            table_resize_bars: true,
            table_grid: false,
            table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
            codesample_languages: [
              { text: 'HTML/XML', value: 'markup' },
              { text: 'JavaScript', value: 'javascript' },
              { text: 'CSS', value: 'css' },
              { text: 'PHP', value: 'php' },
              { text: 'Ruby', value: 'ruby' },
              { text: 'Python', value: 'python' },
              { text: 'Java', value: 'java' },
              { text: 'C', value: 'c' },
              { text: 'C#', value: 'csharp' },
              { text: 'C++', value: 'cpp' }
            ],
            quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
            quickbars_insert_toolbar: 'quickimage quicktable',
            toolbar_mode: 'sliding',
            contextmenu: 'link image table',
            a11y_advanced_options: true
          }}
        />
      </div>
      <style jsx global>{`
        .rich-text-editor-wrapper .tox-tinymce {
          border: none !important;
        }
        .rich-text-editor-wrapper .tox-editor-header {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }
        .rich-text-editor-wrapper .tox-edit-area {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
        .rich-text-editor-wrapper .tox-statusbar {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
        /* Ensure tables are visible in the editor */
        .rich-text-editor-wrapper .tox-edit-area__iframe {
          background-color: #fff;
        }
        .rich-text-editor-wrapper .mce-content-body table {
          display: table !important;
          border-collapse: collapse !important;
          max-width: 80% !important;
          width: 100% !important;
          margin: 1rem auto !important;
        }
        .rich-text-editor-wrapper .mce-content-body table td,
        .rich-text-editor-wrapper .mce-content-body table th {
          border: 1px solid #e5e7eb !important;
          padding: 0.75rem 1rem !important;
          display: table-cell !important;
          min-width: 50px !important;
        }
        .rich-text-editor-wrapper .mce-content-body table th {
          background-color: #f3f4f6 !important;
          font-weight: 600 !important;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
