import { Link, useLocation } from "@remix-run/react";
import {
  MdHomeFilled,
  MdOutlineLocalLaundryService,
  MdOutlineSettings,
} from "react-icons/md";

export default function Menu() {
  const location = useLocation(); // pathの取得
  const { pathname } = location;

  const isHome = pathname === "/home";
  const isWash = pathname === "/wash";
  const isSettings = pathname === "/settings";

  const HomeColor = isHome ? "#006399" : "#1c1B1F"; //アクセスしているなら青 してないならそのまま
  const WashColor = isWash ? "#006399" : "#1c1B1F";
  const SettingsColor = isSettings ? "#006399" : "#1c1B1F";

  return (
    <div>
      <footer className="text-black px-8 fixed bottom-0 w-full">
        {/* 各ページのコンテンツを配置 */}
        {/* メニューバー */}

        <ul className="flex justify-between">
          <li className="text-center">
            <Link to="/home">
              <MdHomeFilled size={40} color={HomeColor} />
              <div style={{ color: HomeColor }}>ホーム</div>
            </Link>
          </li>
          <li className="text-center">
            <Link to="/wash">
              <MdOutlineLocalLaundryService size={40} color={WashColor} />
              <div style={{ color: WashColor }}>洗濯</div>
            </Link>
          </li>
          <li className="text-center">
            <Link to="/settings">
              <MdOutlineSettings size={40} color={SettingsColor} />
              <div style={{ color: SettingsColor }}>設定</div>
            </Link>
          </li>
        </ul>
      </footer>
    </div>
  );
}
