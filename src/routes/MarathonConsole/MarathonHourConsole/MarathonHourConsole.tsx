import { Button, Input } from "@mui/material";
import { FirestoreImageJsonV1 } from "@ukdanceblue/db-app-common";
import { Wysimark, useEditor } from "@wysimark/react";
import { doc, getDocFromServer, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ObservableStatus, useFirestore } from "reactfire";

interface FirestoreHour {
  hourNumber: number;
  hourName: string;
  graphic?: FirestoreImageJsonV1;
  content: string;
}


const MarathonHourConsole = () => {
  const { hourNumber } = useParams<{hourNumber: string}>();

  const firestore = useFirestore();
  const docRef = useRef(doc(firestore, `marathon/2023/hours/${hourNumber}`).withConverter<FirestoreHour>({
    fromFirestore: (snapshot) => {
      const data = snapshot.data();
      if (!data) {
        throw new Error("No data found");
      }
      if (typeof data.hourNumber !== "number") {
        throw new Error("Invalid hour number");
      }
      if (typeof data.hourName !== "string") {
        throw new Error("Invalid hour name");
      }
      if (data.graphic && typeof data.graphic !== "object") {
        throw new Error("Invalid graphic");
      }
      if (typeof data.content !== "string") {
        throw new Error("Invalid content");
      }
      return {
        hourNumber: data.hourNumber,
        hourName: data.hourName,
        graphic: data.graphic,
        content: data.content,
      };
    },
    toFirestore: (model) => {
      if (!model) {
        throw new Error("No model found");
      }
      if (typeof model.hourNumber !== "number") {
        throw new Error("Invalid hour number");
      }
      if (typeof model.hourName !== "string") {
        throw new Error("Invalid hour name");
      }
      if (model.graphic && typeof model.graphic !== "object") {
        throw new Error("Invalid graphic");
      }
      if (typeof model.content !== "string") {
        throw new Error("Invalid content");
      }
      if (model.graphic) {
        return {
          hourNumber: model.hourNumber,
          hourName: model.hourName,
          // @ts-expect-error This is fine
          graphic: model.graphic,
          content: model.content,
        };
      } else {
        return {
          hourNumber: model.hourNumber,
          hourName: model.hourName,
          content: model.content,
        };
      }
    },
  }));

  const [ firestoreHour, setFirestoreHour ] = useState<ObservableStatus<FirestoreHour | undefined>>({ status: "loading", hasEmitted: false, firstValuePromise: Promise.resolve(), isComplete: false, data: undefined, error: undefined });

  useEffect(() => {
    (async () => {
      try {
        const snapshot = await getDocFromServer(docRef.current);

        if (snapshot.exists()) {
          setFirestoreHour({ status: "success", hasEmitted: true, firstValuePromise: Promise.resolve(), isComplete: true, data: snapshot.data(), error: undefined });
        } else {
          setFirestoreHour({ status: "success", hasEmitted: true, firstValuePromise: Promise.resolve(), isComplete: true, data: undefined, error: undefined });
        }
      } catch (error) {
        if (error instanceof Error) {
          setFirestoreHour({ status: "error", hasEmitted: true, firstValuePromise: Promise.resolve(), isComplete: true, data: undefined, error });
        } else {
          setFirestoreHour({ status: "error", hasEmitted: true, firstValuePromise: Promise.resolve(), isComplete: true, data: undefined, error: new Error("Unknown error") });
        }
      }
    })();
  }, []);



  const editor = useEditor({ initialMarkdown: firestoreHour.data?.content ?? "" }, [firestoreHour.data?.content]);

  const navigate = useNavigate();

  return (
    firestoreHour.status === "loading" ? <div>Loading...</div>
      : firestoreHour.status === "error" ? <div>Error: {firestoreHour.error?.message}</div>
        : firestoreHour.status === "success" ? (
          <div>
            <h1>Hour #{hourNumber}</h1>
            <form onSubmit={ (event) => {
              event.preventDefault();
              const form = event.target;
              if (!(form instanceof HTMLFormElement)) {
                return;
              }
              const hourName = (form.elements.namedItem("hourName") as HTMLInputElement).value;
              const graphicUri = (form.elements.namedItem("graphicUri") as HTMLInputElement).value;
              const content = editor.getMarkdown();

              const newHour: FirestoreHour = {
                hourNumber: Number(hourNumber),
                hourName,
                content,
              };

              const graphicUriToUse = graphicUri === "" ? undefined : graphicUri;
              if (graphicUriToUse && (graphicUri.startsWith("http://") || graphicUri.startsWith("https://") || graphicUri.startsWith("gs://"))) {
                newHour.graphic = { uri: graphicUriToUse as FirestoreImageJsonV1["uri"], width: 1920, height: 1080 };
              }

              try {
                setDoc(docRef.current, newHour).then(() => {
                  navigate("/marathon");
                }).catch((error) => {
                  console.error(error);
                  alert(`Error saving hour: ${error?.message}`);
                });
              } catch (error) {
                console.error(error);
                if (error instanceof Error) {
                  alert(`Error saving hour: ${error.message}`);
                }
              }
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}>
              <label htmlFor="hourName">Hour Name</label>
              <Input type="text" name="hourName" id="hourName" defaultValue={firestoreHour.data?.hourName ?? ""} />
              <label htmlFor="graphicUri">Hour Graphic</label>
              <Input type="text" name="graphicUri" id="graphicUri" defaultValue={firestoreHour.data?.graphic?.uri ?? ""} />
              <label htmlFor="content">Hour Content</label>
              <Wysimark
                editor={editor}
              />
              <Button type="submit" variant="outlined">Done</Button>
            </form>
          </div>
        ) : null
  );
};

export default MarathonHourConsole;
