import { Modal } from "@mui/material";
// import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
// import "@cyntler/react-doc-viewer/dist/index.css";

const style = {
  border: "2px solid red",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 480,
  height: "80%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const FileViewer = (props) => {
  const { open, handleClose, fileUrl } = props;

  // const docs = [
  //   {
  //     uri: fileUrl,
  //   },
  // ];

  return (
    <section>
      <Modal open={open} onClose={handleClose}>
        <div style={style}>
          {/* <DocViewer
            documents={docs}
            // initialActiveDocument={docs[0]}
            pluginRenderers={DocViewerRenderers}
            style={{ height: "100%", width: "100%" }}
          /> */}
          <iframe
            src={fileUrl}
            width="100%"
            height="100%"
            allowFullScreen
            title="Google Drive File Viewer"
          ></iframe>
        </div>
      </Modal>
    </section>
  );
};

export default FileViewer;
