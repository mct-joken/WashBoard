import React, { useState } from 'react';

import {
  Link,
  Outlet,
  useLoaderData,
} from "@remix-run/react";
import wash_img from '../../menu_img/menu_wash.png'
import settings_img from '../../menu_img/menu_settings.png'
import home_img from '../../menu_img/menu_home.png'
type Page = 'home' | 'config' | 'wash';

export default function Menu() {
  

  return (

    
    
    <div>
    <footer className="bg-gray-000 text-black p-4 fixed bottom-0 w-full">
      {/* 各ページのコンテンツを配置 */}
      {/* メニューバー */}
      <div>
        <ul className="flex justify-between">
        <li className="list-none ">
          <button onClick={() => handleMenuClick('home')} >
          <img src={home_img} alt="ホーム" className="w-10 h-10" />
            </button>
        </li>
        <li className="list-none">
          <button onClick={() => handleMenuClick('config')}>
          <img src={wash_img} alt="選択" className="w-10 h-10" />
          </button>
          </li>
        <li className="list-none">
          <button onClick={() => handleMenuClick('wash')}>
          <img src={settings_img} alt="設定" className="w-10 h-10" />
          </button>
          </li>
        </ul>
      </div>
    </footer>
    </div>
  );
}

