import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CanvasComponent from "./CanvasComponent";
import Content from "./Content";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <RecoilRoot>
      <div className="w-screen h-screen overflow-hidden">
        <div className="w-screen h-screen">
          <CanvasComponent />
        </div>
        <Content />
        <div className="">
          <script
            type="text/javascript"
            charset="utf-8"
            async
            src="https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3Ab6d6709850429185e6dd585d23c5e7f35960f56a2ab51f278e40fb229fdd152f&amp;width=500&amp;height=400&amp;lang=ru_RU&amp;scroll=true"
          ></script>
        </div>
      </div>
    </RecoilRoot>
  );
}

export default App;
