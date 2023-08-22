import React, { useState } from 'react';

import {
  Link,
  Outlet,
  useLoaderData,
  useLocation,
} from "@remix-run/react";



export default function Menu() {

  const location = useLocation();// pathの取得
  const { pathname } = location;

  const isHome = pathname === '/home';
  const isWash = pathname === '/wash';
  const isSettings = pathname === '/settings';
  
  const HomeColor = isHome? "#006399" : "#1c1B1F";//アクセスしているなら青 してないならそのまま
  const WashColor = isWash?  "#006399" : "#1c1B1F";
  const SettingsColor = isSettings?  "#006399" : "#1c1B1F";

  
  return (

    
    
    <div>

      

    <footer className="bg-gray-000 text-black p-4 fixed bottom-0 w-full">
      {/* 各ページのコンテンツを配置 */}
      {/* メニューバー */}
      <div>
        <ul className="flex justify-between">
        <li className="list-none ">{/*home*/}
          <Link to="/home">
              <svg
                width="40" height="45" viewBox="0 0 40 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.7614 35.16C10.7414 35.3 10.7014 35.66 10.7014 35.88C10.7014 36.41 10.7014 37.25 10.7014 37.73C10.7014 38.55 10.7014 41.79 10.7014 42.5C10.7014 43.03 10.4514 43.3 9.85137 43.3C9.42137 43.3 8.83137 43.27 8.42137 43.23L8.35137 42.43C8.79137 42.51 9.24137 42.55 9.51137 42.55C9.78137 42.55 9.89137 42.43 9.90137 42.17C9.90137 41.62 9.90137 38.21 9.90137 37.73C9.90137 37.39 9.90137 36.4 9.90137 35.87C9.90137 35.66 9.86137 35.31 9.83137 35.16H10.7614ZM6.27137 36.85C6.55137 36.88 6.80137 36.9 7.12137 36.9C7.71137 36.9 12.7614 36.9 13.3514 36.9C13.5814 36.9 13.9214 36.89 14.1614 36.85V37.68C13.9014 37.66 13.6014 37.66 13.3614 37.66C12.7614 37.66 7.73137 37.66 7.12137 37.66C6.82137 37.66 6.53137 37.67 6.27137 37.69V36.85ZM8.57137 39.2C8.14137 40.06 7.21137 41.33 6.64137 41.95L5.96137 41.48C6.62137 40.86 7.48137 39.67 7.87137 38.86L8.57137 39.2ZM12.7514 38.87C13.2814 39.51 14.0814 40.76 14.4814 41.48L13.7414 41.89C13.3414 41.11 12.5914 39.86 12.0714 39.23L12.7514 38.87ZM16.1614 38.67C16.4714 38.7 16.9914 38.73 17.5614 38.73C18.2914 38.73 22.3014 38.73 23.0414 38.73C23.5414 38.73 23.8914 38.69 24.1214 38.67V39.65C23.9114 39.64 23.4914 39.61 23.0514 39.61C22.2914 39.61 18.3014 39.61 17.5614 39.61C17.0114 39.61 16.4814 39.63 16.1614 39.65V38.67ZM30.0686 35.55C29.9686 35.79 29.8586 36.05 29.7186 36.48C29.3986 37.5 28.2386 41.09 27.8086 42.1L26.9086 42.13C27.4086 40.98 28.5686 37.36 28.8686 36.3C28.9986 35.84 29.0386 35.61 29.0686 35.34L30.0686 35.55ZM31.9686 38.9C32.6686 39.92 33.7686 41.94 34.1786 42.97L33.3486 43.34C32.9486 42.26 31.9286 40.18 31.2086 39.23L31.9686 38.9ZM26.5186 41.89C27.9586 41.82 31.5386 41.42 32.8286 41.23L33.0486 42.01C31.6586 42.19 27.9786 42.59 26.5686 42.73C26.3186 42.75 26.0186 42.79 25.7386 42.83L25.5786 41.91C25.8786 41.92 26.2286 41.91 26.5186 41.89Z" 
                fill={HomeColor}/>{/*字の色*/}
                <mask id="mask0_0_1"maskUnits="userSpaceOnUse" x="0" y="0" width="40" height="40">
                  <rect width="40" height="40" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_0_1)">
                  <path d="M6.66669 35V15L20 5L33.3334 15V35H23.3334V23.3333H16.6667V35H6.66669Z" 
                  fill={HomeColor}/>{/*アイコンの色*/}
                </g>
              </svg>
            </Link>
        </li>
        <li className="list-none">{/*wash*/}
           <Link to="/wash">
              <svg
                width="40" height="45" viewBox="0 0 40 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.05 38.75H19.6V39.47H13.05V38.75ZM14.26 36.25H19.2V36.96H14.26V36.25ZM16 34.61H16.74V39.14H16V34.61ZM14.35 34.76L15.1 34.89C14.83 36.28 14.35 37.6 13.74 38.46C13.59 38.35 13.27 38.15 13.08 38.06C13.69 37.26 14.12 36.02 14.35 34.76ZM16.86 39.2H17.59V42.67C17.59 42.95 17.63 43 17.9 43C18.01 43 18.58 43 18.73 43C18.99 43 19.04 42.8 19.07 41.49C19.23 41.62 19.53 41.74 19.73 41.8C19.66 43.28 19.49 43.68 18.8 43.68C18.64 43.68 17.94 43.68 17.79 43.68C17.05 43.68 16.86 43.46 16.86 42.67V39.2ZM14.82 39.3H15.57C15.44 41.55 15.08 43 13.06 43.81C12.97 43.63 12.76 43.36 12.6 43.22C14.45 42.54 14.72 41.28 14.82 39.3ZM10.85 35.23L11.3 34.72C11.9 35.02 12.65 35.51 13.01 35.87L12.55 36.45C12.2 36.08 11.46 35.56 10.85 35.23ZM10.38 37.93L10.8 37.38C11.42 37.67 12.2 38.14 12.58 38.48L12.15 39.09C11.77 38.73 11 38.24 10.38 37.93ZM10.66 43.22C11.13 42.44 11.79 41.11 12.27 39.97L12.83 40.4C12.4 41.47 11.81 42.74 11.32 43.68L10.66 43.22ZM23.45 36.22H25.6V36.76H23.45V36.22ZM23.25 35H25.95V38.02H23.24V37.46H25.25V35.56H23.25V35ZM26.62 36.22H28.81V36.76H26.62V36.22ZM24.16 40.37H28.94V40.91H24.16V40.37ZM24.16 41.59H28.94V42.14H24.16V41.59ZM24.12 42.85H29.52V43.47H24.12V42.85ZM26.41 35H29.19V38.02H26.39V37.46H28.48V35.56H26.41V35ZM24.39 37.98L25.12 38.19C24.65 39.15 23.91 40.25 23.12 40.96C23 40.82 22.75 40.61 22.59 40.51C23.33 39.85 24.05 38.82 24.39 37.98ZM24.44 39.08H29.27V39.69H24.44V43.81H23.76V39.58L24.23 39.08H24.44ZM26.65 38.06L27.39 38.27C27.14 38.75 26.86 39.25 26.63 39.59L26.04 39.39C26.25 39.02 26.52 38.44 26.65 38.06ZM26.1 39.44H26.8V43.08H26.1V39.44ZM20.87 35.23L21.3 34.68C21.88 34.94 22.6 35.37 22.96 35.7L22.51 36.32C22.17 35.98 21.46 35.51 20.87 35.23ZM20.37 37.95L20.79 37.38C21.4 37.61 22.14 38.01 22.51 38.32L22.08 38.95C21.71 38.63 20.98 38.2 20.37 37.95ZM20.61 43.23C21.06 42.46 21.68 41.16 22.14 40.04L22.73 40.48C22.31 41.53 21.76 42.75 21.28 43.68L20.61 43.23Z" 
                fill={WashColor}/>{/*字の色*/}
                <mask id="mask0_0_1"  maskUnits="userSpaceOnUse" x="1" y="0" width="38" height="38">
                  <rect x="1" width="38" height="38" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_0_1)">
                    <path d="M13.6666 11.0834C14.1153 11.0834 14.4913 10.9316 14.7948 10.6281C15.0982 10.3247 15.25 9.94863 15.25 9.50002C15.25 9.05141 15.0982 8.67537 14.7948 8.3719C14.4913 8.06842 14.1153 7.91669 13.6666 7.91669C13.218 7.91669 12.842 8.06842 12.5385 8.3719C12.235 8.67537 12.0833 9.05141 12.0833 9.50002C12.0833 9.94863 12.235 10.3247 12.5385 10.6281C12.842 10.9316 13.218 11.0834 13.6666 11.0834ZM18.4166 11.0834C18.8653 11.0834 19.2413 10.9316 19.5448 10.6281C19.8482 10.3247 20 9.94863 20 9.50002C20 9.05141 19.8482 8.67537 19.5448 8.3719C19.2413 8.06842 18.8653 7.91669 18.4166 7.91669C17.968 7.91669 17.592 8.06842 17.2885 8.3719C16.985 8.67537 16.8333 9.05141 16.8333 9.50002C16.8333 9.94863 16.985 10.3247 17.2885 10.6281C17.592 10.9316 17.968 11.0834 18.4166 11.0834ZM20 28.5C21.6625 28.5 23.0809 27.9327 24.2552 26.7979C25.4295 25.6632 26.0166 24.2778 26.0166 22.6417C26.0166 21.8764 25.8847 21.1309 25.6208 20.4052C25.3569 19.6795 24.9611 19.0528 24.4333 18.525L20 14.0917L15.725 18.3667C15.1444 18.9472 14.7024 19.607 14.3989 20.3459C14.0955 21.0847 13.9569 21.85 13.9833 22.6417C14.0361 24.2778 14.643 25.6632 15.8041 26.7979C16.9653 27.9327 18.3639 28.5 20 28.5ZM20 25.4917C19.2083 25.4917 18.5354 25.2146 17.9812 24.6604C17.4271 24.1063 17.15 23.4334 17.15 22.6417C17.15 22.2459 17.2225 21.8698 17.3677 21.5136C17.5128 21.1573 17.7305 20.834 18.0208 20.5438L20 18.5646L21.9396 20.5042C22.2298 20.7945 22.4541 21.1243 22.6125 21.4938C22.7708 21.8632 22.85 22.2459 22.85 22.6417C22.85 23.4334 22.5729 24.1063 22.0187 24.6604C21.4646 25.2146 20.7916 25.4917 20 25.4917ZM10.5 34.8334C9.62915 34.8334 8.88366 34.5233 8.26352 33.9031C7.64338 33.283 7.33331 32.5375 7.33331 31.6667V6.33335C7.33331 5.46252 7.64338 4.71703 8.26352 4.0969C8.88366 3.47676 9.62915 3.16669 10.5 3.16669H29.5C30.3708 3.16669 31.1163 3.47676 31.7364 4.0969C32.3566 4.71703 32.6666 5.46252 32.6666 6.33335V31.6667C32.6666 32.5375 32.3566 33.283 31.7364 33.9031C31.1163 34.5233 30.3708 34.8334 29.5 34.8334H10.5ZM10.5 31.6667H29.5V6.33335H10.5V31.6667Z" 
                    fill={WashColor}/>{/*アイコンの色*/}
                </g>
              </svg>

            </Link>
          
        </li>
        <li className="list-none">{/*settings*/}
          <Link to="/settings">
          <svg width="40" height="43" viewBox="0 0 40 43" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.96 32.92H15.68V34.14C15.68 35.01 15.46 36.07 14.39 36.78C14.29 36.64 14 36.38 13.85 36.28C14.81 35.66 14.96 34.83 14.96 34.13V32.92ZM17.4 32.92H18.11V35.38C18.11 35.6 18.14 35.64 18.3 35.64C18.38 35.64 18.71 35.64 18.81 35.64C18.98 35.64 19.02 35.51 19.04 34.55C19.18 34.66 19.48 34.77 19.67 34.82C19.61 35.99 19.43 36.3 18.89 36.3C18.76 36.3 18.32 36.3 18.19 36.3C17.58 36.3 17.4 36.1 17.4 35.39V32.92ZM15.5 37.64C16.19 39.36 17.68 40.64 19.69 41.15C19.52 41.31 19.3 41.61 19.2 41.8C17.12 41.19 15.63 39.81 14.83 37.85L15.5 37.64ZM18.3 36.94H18.45L18.58 36.91L19.06 37.1C18.35 39.72 16.47 41.16 14.28 41.8C14.2 41.62 14.01 41.3 13.87 41.14C15.89 40.63 17.7 39.28 18.3 37.06V36.94ZM14.31 36.94H18.59V37.62H14.31V36.94ZM15.26 32.92H17.76V33.59H15.26V32.92ZM10.85 35.63H13.83V36.23H10.85V35.63ZM10.9 32.96H13.81V33.56H10.9V32.96ZM10.85 36.97H13.83V37.57H10.85V36.97ZM10.38 34.27H14.18V34.89H10.38V34.27ZM11.21 38.32H13.83V41.24H11.21V40.61H13.17V38.94H11.21V38.32ZM10.84 38.32H11.49V41.7H10.84V38.32ZM22.11 35.66H27.94V36.38H22.11V35.66ZM24.99 38.05H28.36V38.76H24.99V38.05ZM24.59 36.03H25.37V41.09L24.59 40.99V36.03ZM22.22 37.24L23 37.32C22.72 39.34 22.09 40.87 20.96 41.85C20.84 41.72 20.52 41.46 20.34 41.35C21.46 40.48 22 39.05 22.22 37.24ZM22.69 38.53C23.4 40.57 24.96 40.92 26.99 40.92C27.36 40.92 29.09 40.92 29.58 40.91C29.46 41.09 29.33 41.45 29.3 41.67H26.95C24.57 41.67 22.94 41.2 22.08 38.76L22.69 38.53ZM24.58 32.61H25.37V34.23H24.58V32.61ZM20.82 33.75H29.18V35.93H28.41V34.47H21.56V35.93H20.82V33.75Z" 
            fill={SettingsColor}/>{/*字の色*/}
            <mask id="mask0_0_1"  maskUnits="userSpaceOnUse" x="3" y="0" width="35" height="35">
              <rect x="3" width="35" height="35" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0_0_1)">
              <path d="M17.1347 31.3541L16.5794 26.9118C16.1886 26.781 15.788 26.5977 15.3776 26.3622C14.9672 26.1266 14.6003 25.8741 14.2768 25.6049L10.1627 27.3437L6.79733 21.5104L10.3562 18.8209C10.3226 18.604 10.2987 18.3862 10.2847 18.1675C10.2707 17.9487 10.2636 17.7309 10.2636 17.514C10.2636 17.3065 10.2707 17.0957 10.2847 16.8816C10.2987 16.6675 10.3226 16.4333 10.3562 16.1791L6.79733 13.4896L10.1627 7.68436L14.2628 9.40913C14.6143 9.13054 14.9896 8.8758 15.3888 8.6449C15.788 8.41397 16.1802 8.2284 16.5653 8.08818L17.1347 3.64587H23.8653L24.4206 8.10221C24.8581 8.26112 25.254 8.44668 25.6083 8.6589C25.9626 8.87111 26.3202 9.12119 26.6811 9.40913L30.8373 7.68436L34.2026 13.4896L30.5877 16.2211C30.64 16.4567 30.6685 16.6769 30.6732 16.8816C30.6779 17.0863 30.6802 17.2925 30.6802 17.5C30.6802 17.6982 30.6755 17.8997 30.6662 18.1044C30.6568 18.3091 30.6232 18.5433 30.5652 18.8069L34.1522 21.5104L30.7868 27.3437L26.6811 25.5909C26.3202 25.8788 25.9519 26.1336 25.5761 26.3551C25.2003 26.5767 24.8151 26.7576 24.4206 26.8978L23.8653 31.3541H17.1347ZM20.5168 21.875C21.7302 21.875 22.7627 21.4492 23.6143 20.5975C24.4659 19.7459 24.8918 18.7134 24.8918 17.5C24.8918 16.2866 24.4659 15.2541 23.6143 14.4025C22.7627 13.5509 21.7302 13.125 20.5168 13.125C19.2885 13.125 18.2522 13.5509 17.4081 14.4025C16.5639 15.2541 16.1419 16.2866 16.1419 17.5C16.1419 18.7134 16.5639 19.7459 17.4081 20.5975C18.2522 21.4492 19.2885 21.875 20.5168 21.875ZM20.5168 19.6875C19.9091 19.6875 19.3927 19.4748 18.9673 19.0495C18.542 18.6241 18.3293 18.1076 18.3293 17.5C18.3293 16.8924 18.542 16.3759 18.9673 15.9505C19.3927 15.5252 19.9091 15.3125 20.5168 15.3125C21.1244 15.3125 21.6409 15.5252 22.0663 15.9505C22.4916 16.3759 22.7043 16.8924 22.7043 17.5C22.7043 18.1076 22.4916 18.6241 22.0663 19.0495C21.6409 19.4748 21.1244 19.6875 20.5168 19.6875ZM19.0416 29.1667H21.9078L22.4323 25.26C23.1764 25.0656 23.8565 24.7893 24.4725 24.4313C25.0886 24.0733 25.6827 23.6129 26.2548 23.0501L29.8782 24.5729L31.3141 22.0938L28.1506 19.7099C28.2721 19.3323 28.3549 18.9621 28.3988 18.5994C28.4427 18.2367 28.4647 17.8702 28.4647 17.5C28.4647 17.1205 28.4427 16.754 28.3988 16.4006C28.3549 16.0473 28.2721 15.6864 28.1506 15.3181L31.3421 12.9063L29.9062 10.4271L26.2407 11.9724C25.7528 11.4507 25.1681 10.9899 24.4866 10.5898C23.805 10.1896 23.1156 9.90639 22.4182 9.74L21.9583 5.83334H19.0641L18.5817 9.72596C17.8376 9.90171 17.1505 10.1709 16.5204 10.5337C15.8903 10.8964 15.2892 11.3638 14.7171 11.9359L11.0937 10.4271L9.65782 12.9063L12.8073 15.2536C12.6857 15.5995 12.6007 15.9594 12.5521 16.3333C12.5035 16.7073 12.4791 17.1008 12.4791 17.514C12.4791 17.8936 12.5035 18.2656 12.5521 18.6302C12.6007 18.9948 12.6811 19.3547 12.7932 19.7099L9.65782 22.0938L11.0937 24.5729L14.7031 23.0417C15.2565 23.6101 15.8483 24.0756 16.4783 24.4383C17.1084 24.801 17.8049 25.0796 18.5677 25.2741L19.0416 29.1667Z" 
              fill={SettingsColor}/>{/*アイコンの色*/}
            </g>
          </svg>

          </Link>
          
          </li>
        </ul>
      </div>
    </footer>
    </div>
  );
}

