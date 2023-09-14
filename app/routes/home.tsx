// home.tsx
import React from "react";
import Menu from "~/components/menu";
const Home = () => {
  return (
    <div className=" mt-2 mx-3">
      <div className="flex flex-row">
        <img src={Logo} alt="ロゴ" className=" h-10 mx-center my-auto"></img>
        <p className=" text-2xl  mx-auto my-auto">利用状況</p>
      </div>
      <div className=" flex flex-row justify-center my-3">
        <div className="w-20 mx-3">
          <form>
            <div>
              <select name="sort" id="sort" onChange={dataChange}>
                <option value="all" selected>
                  すべて
                </option>
                <option value="empty">空きあり</option>
                <option value="favorite">お気に入り</option>
              </select>
            </div>
          </form>
        </div>
      </div>
      <p className="border rounded mx-10"></p>
      <div className=" max-h-72 mx-5 px-5 my-5  overflow-y-auto">
        {show_select_data(data)}
      </div>
      <p className="border rounded mx-10"></p>
      <p className="text-center mb-5">あなたの利用状況</p>
      {is_use()}
      <Menu />
    </div>
  );
}
