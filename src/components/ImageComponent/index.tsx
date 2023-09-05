export default function Image({ url, alt, className }: any) {
  return (
    // <img
    //   src={`data:image/${url?.file_type};base64,${url?.base64_content}`}
    //   alt={alt}
    //   className={className}
    // />
    <img src={`${url}`} alt={alt} className={className} />
  );
}
