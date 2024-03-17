const FileInput = (props: {
  title: string;
  onChange: (files: FileList) => void;
}) => (
  <>
    <label className="text-base h-10 flex items-center justify-center font-normal custom-file-upload bg-yellow w-[250px] text-black  hover:bg-darkyellow dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90">
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files?.length) {
            props.onChange(e.target.files);
          }
        }}
      />
      {props.title}
    </label>
  </>
);

export default FileInput;
