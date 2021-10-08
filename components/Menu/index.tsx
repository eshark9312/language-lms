import { Menu, Button } from "antd";
import React, {
  useEffect,
  useState,
  useReducer,
  PureComponent,
  useRef,
} from "react";
import { useRouter } from "next/router";

import { BarChart, Bar, LineChart, Line } from "recharts";

import {
  PaperClipOutlined,
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
} from "@ant-design/icons";
import ReactHtmlParser from "react-html-parser";
import { AdminChildMenu, AdminParentMenu } from "~/lib/data-menu/AdminMenu";
import {
  TeacherChildMenu,
  TeacherParentMenu,
} from "~/lib/data-menu/TeacherMenu";
import { useWrap } from "~/context/wrap";
import { useSession } from "next-auth/client";
import Link from "next/link";

type childMenu = [];

const { SubMenu } = Menu;

type propState = {
  collapsed: boolean;
};

const MenuDefault = ({
  isOpen,
  isOpenMenu,
  openMenuMobile,
  funcMenuMobile,
  resetMenuMobile,
}: {
  resetMenuMobile: Function;
  funcMenuMobile: Function;
  openMenuMobile: boolean;
  isOpen: boolean;
  isOpenMenu: Function;
}) => {
  // const router = useRouter();
  // const getRouter = router.pathname;

  const router = useRouter();
  let getRouter = router.pathname;

  const [state, setState] = useState<propState>({
    collapsed: isOpen,
  } as propState);
  const [isHover, setIsHover] = useState({
    changeHeight: null,
    status: false,
    position: null,
  });

  const [tab, tabSet] = useState<String>("tab-home");
  const [subMenuActive, setSubMenuActive] = useState("");
  const menuChild = useRef(null);
  const [posMenu, setPosMenu] = useState(null);
  const [openKeys, setOpenKeys] = useState(null);
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [sameTab, setSameTab] = useState(false);
  const [parentMenu, setParentMenu] = useState([]);
  const [childMenu, setChildMenu] = useState([]);
  const [session, loading] = useSession();

  const changeTabs = (e) => {
    e.preventDefault();

    let element = e.target;
    let position = element.getBoundingClientRect();
    setPosMenu(position);

    if (!isOpen) {
      let dataTab = e.target.getAttribute("data-tabs");

      dataTab === tab ? setSameTab(true) : tabSet(dataTab);

      setStatusOpen(true);

      setIsHover({
        ...isHover,
        status: true,
        changeHeight: false,
      });
    }
  };

  const changeTabsClick = (e) => {
    e.preventDefault();

    let dataTab = e.target.getAttribute("data-tabs");
    tabSet(dataTab);
  };

  const closeTabs = (e) => {
    e.preventDefault();

    // Xóa tab trước khi tìm active tab
    tabSet("");

    // Func tìm active tap
    FindTabActive();

    // Reset is Hover
    if (isHover.status) {
      setStatusOpen(false);
      setIsHover({
        changeHeight: false,
        status: false,
        position: null,
      });
    }
  };

  const FindTabActive = () => {
    childMenu.forEach((menu, index) => {
      menu.MenuItem.forEach((item, ind) => {
        if (getRouter === "/") {
          tabSet("tab-home");
        } else {
          if (item.ItemType === "sub-menu") {
            item.SubMenuList.forEach((itemSub, key) => {
              if (itemSub.Route === getRouter) {
                tabSet(menu.MenuName);
                return false;
              }
            });
          } else {
            if (item.Route === getRouter) {
              tabSet(menu.MenuName);
              return false;
            }
          }
        }
      });
    });
  };

  const FindSubMenuActive = () => {
    let SubMenuActive = "";
    childMenu.forEach((menu, index) => {
      menu.MenuItem.forEach((item, ind) => {
        if (item.ItemType === "sub-menu") {
          item.SubMenuList.forEach((itemSub, key) => {
            if (itemSub.Route === getRouter) {
              setSubMenuActive(item.Key);
              return false;
            }
          });
        }
      });
    });
  };

  const onOpenChange = (openKeys) => {
    setOpenKeys(openKeys);
    if (openKeys.length > 0) {
      for (const value of openKeys) {
        childMenu.forEach((menu, index) => {
          menu.MenuItem.forEach((item, ind) => {
            if (item.ItemType === "sub-menu") {
              if (item.Key === value) {
                setSubMenuActive(value);
                return false;
              }
            }
          });
        });
      }
    } else {
      setSubMenuActive("");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      // Get height Screen window
      let heightScr = window.innerHeight;
      heightScr = heightScr / 2;

      // Get height menu when hover
      let heightMenu = menuChild.current.clientHeight;

      if (!isOpen) {
        if (openKeys.length > 0) {
          if (heightMenu > heightScr) {
            setIsHover({
              ...isHover,
              changeHeight: true,
            });
          }
        } else {
          setIsHover({
            ...isHover,
            changeHeight: false,
          });
        }
      }
    }, 200);
  }, [openKeys]);

  useEffect(() => {
    console.log("Chạy get router");
    let widthScr = window.innerWidth;
    widthScr < 1000 ? resetMenuMobile() : FindSubMenuActive(), FindTabActive();
  }, [getRouter]);

  useEffect(() => {
    !isOpen &&
      (setIsHover({
        ...isHover,
        status: false,
      }),
      FindTabActive());
  }, [isOpen]);

  const changeTabsWithPostion = () => {
    // Get height menu when hover
    let heightMenu = menuChild.current.clientHeight;

    // Get height Screen window
    let heightScr = window.innerHeight;

    if (posMenu !== null) {
      // Get position menu when hover
      const position = posMenu;

      setIsHover({
        changeHeight: !isOpen && heightMenu > heightScr / 2 ? true : false,
        status: !statusOpen ? false : true,
        position: !statusOpen
          ? null
          : heightMenu > heightScr / 2
          ? position.top > heightScr / 3
            ? position.top - heightScr / 3
            : position.top - 65
          : position.top - 52,
      });
    }
  };

  // Functions fine active menu when at detail page
  const convertRouter = (router: string) => {
    let arrRouter = router.split("/");

    arrRouter = arrRouter.filter(function (item) {
      if (item == "" || item == "[slug]" || item.search("detail") > 0) {
        return false;
      }
      return true;
    });

    let finalRouter = "";

    arrRouter.forEach((item) => {
      finalRouter = finalRouter + "/" + item;
    });

    return finalRouter;
  };

  getRouter = convertRouter(getRouter);

  const closeMenuMobile = (e) => {
    e.preventDefault();
    funcMenuMobile();
  };

  useEffect(() => {
    changeTabsWithPostion();
  }, [tab]);

  useEffect(() => {
    if (sameTab) {
      changeTabsWithPostion();
      setTimeout(() => {
        setSameTab(false);
      }, 100);
    }
  }, [sameTab]);

  function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }

  useEffect(() => {
    console.log("Chạy menu");
    if (session !== undefined) {
      let token = session.accessToken;
      let userInfor = parseJwt(token);
      console.log("userInfo: ", userInfor);
      switch (parseInt(userInfor.roleID)) {
        case 1:
          setParentMenu(AdminParentMenu);
          setChildMenu(AdminChildMenu);
          break;
        case 2:
          setParentMenu(TeacherParentMenu);
          setChildMenu(TeacherChildMenu);
          break;
        default:
          break;
      }
    }
  }, []);

  useEffect(() => {
    if (childMenu.length > 0) {
      FindSubMenuActive();
      FindTabActive();
    }
  }, [childMenu]);

  return (
    <aside className={`navbar-right ${openMenuMobile ? "mobile" : ""}`}>
      <div className={`navbar-right-bg ${openMenuMobile ? "active" : ""}`}>
        <a href="#" onClick={closeMenuMobile}></a>
      </div>
      <div className="menu-parent">
        <div className="menu-parent-logo">
          <Link href="/dashboard">
            <a>
              {" "}
              {/* <img className="logo-img" src="/images/logo.png"></img> */}
            </a>
          </Link>
        </div>
        <div className="menu-parent-body">
          <ul className="list-menu">
            {parentMenu.map((item, index) => (
              <li className={tab === item.TabName ? "active" : ""} key={index}>
                <b className={tab === item.TabName ? "" : "d-none"}></b>
                <b className={tab === item.TabName ? "" : "d-none"}></b>
                <a
                  href="#"
                  onClick={changeTabsClick}
                  onMouseEnter={changeTabs}
                  data-tabs={item.TabName}
                >
                  {item.Icon}
                </a>
              </li>
            ))}
            {/* <li className={tab === "tab-home" ? "active" : ""} key="1">
              <a
                href="#"
                onClick={changeTabsClick}
                onMouseEnter={changeTabs}
                data-tabs="tab-home"
              >
                <Home />
              </a>
            </li>

            <li className={tab === "tab-course" ? "active" : ""} key="2">
              <a
                href="#"
                onClick={changeTabsClick}
                onMouseEnter={changeTabs}
                data-tabs="tab-course"
              >
                <Airplay />
              </a>
            </li>
            <li className={tab === "tab-customer" ? "active" : ""} key="3">
              <a
                href="#"
                onClick={changeTabsClick}
                onMouseEnter={changeTabs}
                data-tabs="tab-customer"
              >
                <User />
              </a>
            </li>
            <li className={tab === "tab-staff" ? "active" : ""} key="4">
              <a
                href="#"
                onClick={changeTabsClick}
                onMouseEnter={changeTabs}
                data-tabs="tab-staff"
              >
                <UserCheck />
              </a>
            </li>
            <li className={tab === "tab-package" ? "active" : ""} key="5">
              <a
                href="#"
                onClick={changeTabsClick}
                onMouseEnter={changeTabs}
                data-tabs="tab-package"
              >
                <Package />
              </a>
            </li>

            <li className={tab === "tab-document" ? "active" : ""} key="6">
              <a
                href="#"
                onClick={changeTabsClick}
                onMouseEnter={changeTabs}
                data-tabs="tab-document"
              >
                <Book />
              </a>
            </li>
            <li className={tab === "tab-question-bank" ? "active" : ""} key="7">
              <a
                href="#"
                onClick={changeTabsClick}
                onMouseEnter={changeTabs}
                data-tabs="tab-question-bank"
              >
                <FileText />
              </a>
            </li>
            <li className={tab === "tab-option" ? "active" : ""} key="8">
              <a
                href="#"
                onClick={changeTabsClick}
                onMouseEnter={changeTabs}
                data-tabs="tab-option"
              >
                <Tool />
              </a>
            </li>
            <li className={tab === "tab-layout" ? "active" : ""} key="9">
              <a
                href="#"
                onClick={changeTabsClick}
                onMouseEnter={changeTabs}
                data-tabs="tab-layout"
              >
                <Layers />
              </a>
            </li> */}
          </ul>
        </div>
      </div>
      <div
        className={`menu-child-bg ${
          !isOpen && `${isHover.status ? "open" : ""}`
        }`}
        onMouseEnter={closeTabs}
      ></div>
      <div
        className={`menu-child  ${
          !isOpen && `close-app  ${isHover.status ? "hover-open" : ""} `
        }`}
      >
        <div className="app-header-logo">
          <p>Mona Media</p>
        </div>
        <div
          className={`menu-child-body ${
            isHover.changeHeight ? "change-height" : ""
          }`}
          ref={menuChild}
          style={{
            top: isHover.status ? isHover.position : "unset",
          }}
        >
          {childMenu?.map((menu, indexMenu) => (
            <div key={indexMenu}>
              <Menu
                key={indexMenu}
                onOpenChange={onOpenChange}
                selectedKeys={[getRouter == "/" ? "/dashboard" : getRouter]}
                openKeys={[subMenuActive]}
                mode="inline"
                theme="light"
                style={{ display: tab === menu.MenuName ? "block" : "none" }}
              >
                <Menu.ItemGroup key={menu.MenuKey} title={menu.MenuTitle}>
                  {menu.MenuItem?.map((item, indexItem) =>
                    item.ItemType !== "sub-menu" ? (
                      <Menu.Item
                        key={item.Key}
                        icon={ReactHtmlParser(item.Icon)}
                      >
                        <Link href={item.Route}>
                          <a>{item.Text}</a>
                        </Link>
                      </Menu.Item>
                    ) : (
                      <SubMenu
                        key={item.Key}
                        icon={ReactHtmlParser(item.Icon)}
                        title={item.TitleSub}
                      >
                        {item?.SubMenuList.map((subitem, indexSubitem) => (
                          <Menu.Item
                            key={subitem.Key}
                            icon={ReactHtmlParser(subitem.Icon)}
                          >
                            <Link href={subitem.Route}>
                              <a>{subitem.Text}</a>
                            </Link>
                          </Menu.Item>
                        ))}
                      </SubMenu>
                    )
                  )}
                </Menu.ItemGroup>
              </Menu>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default MenuDefault;
