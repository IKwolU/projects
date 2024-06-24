import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CanvasComponent from "./CanvasComponent";
import Content from "./Content";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <RecoilRoot>
      <div
        className="w-screen h-screen overflow-hidden font-stolzl"
        // style={{ fontFamily: "Graphik-Regular" }}
      >
        <div className="w-screen h-screen">
          <CanvasComponent />
        </div>
        <Content />
      </div>
    </RecoilRoot>
  );
}

export default App;
