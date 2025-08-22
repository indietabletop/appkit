export function ReleaseInfo(props: {
  branch?: string;
  shortcode?: string;
  backgroundColor?: string;
}) {
  if (!props.branch || !props.shortcode) {
    return <>Release [local]</>;
  }

  return (
    <>
      {`Release `}
      <code
        style={{
          fontSize: "0.875em",
          backgroundColor: props.backgroundColor,
          paddingInline: "0.25rem",
          paddingBlock: "0.125rem",
          borderRadius: "0.25rem",
          fontFamily: "monospace",
        }}
      >
        {props.shortcode}
      </code>

      {props.branch === "main" ? "" : ` (${props.branch})`}
    </>
  );
}
