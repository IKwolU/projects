<template>
    <div class="rounded-lg overflow-hidden">
        <ckeditor
            :editor="editor"
            v-model="editorData"
            :config="editorConfig"
        >
        </ckeditor>
    </div>
</template>

<script>

import {defineComponent} from 'vue';
import { SimpleUploadAdapter } from '@ckeditor/ckeditor5-upload';
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';

import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CloudServices } from '@ckeditor/ckeditor5-cloud-services';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Heading } from '@ckeditor/ckeditor5-heading';
import {
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    ImageResizeEditing,
    ImageResizeHandles
} from '@ckeditor/ckeditor5-image';
import { Indent } from '@ckeditor/ckeditor5-indent';
import { Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
import { Table, TableToolbar } from '@ckeditor/ckeditor5-table';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';
import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { CodeBlock } from '@ckeditor/ckeditor5-code-block';
import { Font, FontFamily } from '@ckeditor/ckeditor5-font';
export default defineComponent({
    name: "TextEditor",
    emits:['editorData'],
    props: ['data'],
    data() {
        return {
            editor: ClassicEditor,
            editorData: this.data,
            editorConfig: {
                plugins: [
                    Font,
                    CodeBlock,
                    SimpleUploadAdapter,
                    Alignment,
                    Autoformat,
                    BlockQuote,
                    Bold,
                    CloudServices,
                    Essentials,
                    Heading,
                    Image,
                    ImageCaption,
                    ImageStyle,
                    ImageToolbar,
                    ImageUpload,
                    Indent,
                    Italic,
                    Link,
                    List,
                    MediaEmbed,
                    Paragraph,
                    PasteFromOffice,
                    Table,
                    TableToolbar,
                    TextTransformation,
                    ImageResizeEditing,
                    ImageResizeHandles,
                    FontFamily
                ],

                toolbar: {
                    items: [
                        'alignment',
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'link',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'fontSize',
                        'fontFamily',
                        'fontColor',
                        'fontBackgroundColor',
                        'fontFamily',
                        '|',
                        'outdent',
                        'indent',
                        '|',
                        'imageUpload',
                        'blockQuote',
                        'insertTable',
                        'mediaEmbed',
                        'undo',
                        'redo',
                        '|',
                        'codeBlock',
                    ]
                },
                language: 'ru',
                image: {
                    toolbar: [
                        'imageTextAlternative',
                        'toggleImageCaption',
                        'imageStyle:inline',
                        'imageStyle:block',
                        'imageStyle:side'
                    ]
                },
                table: {
                    contentToolbar: [
                        'tableColumn',
                        'tableRow',
                        'mergeTableCells'
                    ]
                },
                simpleUpload: {
                    // The URL that the images are uploaded to.
                    uploadUrl: '/api/loadimage',

                },
                codeBlock: {
                    languages: [
                        { language: 'css', label: 'CSS' },
                        { language: 'html', label: 'HTML' }
                    ]
                }
            }
        };
    },
    methods: {
        sendData(){
            setInterval(()=>{
                this.$emit('editorData', this.editorData);
            },1000);
        },
    },
    mounted() {
        this.sendData();
    }
})
</script>

<style>
.ck-editor__editable_inline {
    min-height: 600px;
}
.ck .ck-editor__main > .ck-editor__editable{
    background: #374151;
    border: gray;
}


.ck.ck-toolbar {
    border: 0;
}
.ck .ck-powered-by{
    display: none;
}



</style>

