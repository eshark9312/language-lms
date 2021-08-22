import { Tooltip } from "antd";
import moment from "moment";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { studentApi } from "~/apiBase";
import FilterBase from "~/components/Elements/FilterBase/FilterBase";
import SortBox from "~/components/Elements/SortBox";
import ExpandTable from "~/components/ExpandTable";
import LayoutBase from "~/components/LayoutBase";
import FilterColumn from "~/components/Tables/FilterColumn";
import { useWrap } from "~/context/wrap";
import { packageResultApi } from "~/apiBase/package/package-result";
import { packageDetailApi } from "~/apiBase/package/package-detail";
import PackageResultExpand from "~/components/Global/Package/PackageResult/PackageResultExpand";

const PackageSetResult = () => {
  const onSearch = (data) => {
    setCurrentPage(1);
    setParams({
      ...listParamsDefault,
      StudentName: data,
    });
  };

  const handleReset = () => {
    setCurrentPage(1);
    setParams(listParamsDefault);
  };
  const columns = [
    {
      title: "Học viên",
      dataIndex: "StudentName",
      ...FilterColumn("FullNameUnicode", onSearch, handleReset, "text"),
      render: (text) => <p className="font-weight-blue">{text}</p>,
    },

    {
      title: "Đề thi",
      dataIndex: "ExamTopicName",
    },
    {
      title: "Mức độ",
      dataIndex: "SetPackageLevel",
      render: (text) => <p className="font-weight-black">{text}</p>,
    },
    {
      title: "Hình thức",
      dataIndex: "ExamTopicTypeName",
      render: (text) => <p className="font-weight-black">{text}</p>,
    },
    {
      title: "Giáo viên",
      dataIndex: "TeacherName",
    },
    {
      title: "Trạng thái",
      dataIndex: "isDone",
      render: (type) => (
        <Fragment>
          {type == true && <span className="tag green">Đã hoàn thành</span>}
          {type == false && <span className="tag yellow">Chưa hoàn thành</span>}
        </Fragment>
      ),
    },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const [itemDetail, setItemDetail] = useState();

  const listParamsDefault = {
    pageSize: 10,
    pageIndex: currentPage,
    sort: null,
    sortType: null,
    fromDate: null,
    toDate: null,
    StudentID: null,
    SetPackageDetailID: null,
    isDone: null,
    StudentName: null,
  };

  const sortOption = [
    {
      dataSort: {
        sortType: null,
      },
      value: 1,
      text: "Mới cập nhật",
    },
    {
      dataSort: {
        sortType: true,
      },
      value: 2,
      text: "Từ dưới lên",
    },
  ];

  const [dataFilter, setDataFilter] = useState([
    {
      name: "StudentID",
      title: "Học viên",
      col: "col-12",
      type: "select",
      optionList: null,
      value: null,
    },
    {
      name: "SetPackageDetailID",
      title: "Gói bài",
      col: "col-12",
      type: "select",
      optionList: null,
      value: null,
    },
    {
      name: "isDone",
      title: "Trạng thái",
      col: "col-12",
      type: "select",
      optionList: [
        {
          value: true,
          title: "Đã hoàn thành",
        },
        {
          value: false,
          title: "Chưa hoàn thành",
        },
      ],
      value: null,
    },
    {
      name: "date-range",
      title: "Ngày tạo",
      col: "col-12",
      type: "date-range",
      value: null,
    },
  ]);

  const handleFilter = (listFilter) => {
    console.log("List Filter when submit: ", listFilter);

    let newListFilter = {
      pageIndex: 1,
      fromDate: null,
      toDate: null,
      StudentID: null,
      SetPackageDetailID: null,
      isDone: null,
      StudentName: null,
    };
    listFilter.forEach((item, index) => {
      let key = item.name;
      Object.keys(newListFilter).forEach((keyFilter) => {
        if (keyFilter == key) {
          newListFilter[key] = item.value;
        }
      });
    });
    setParams({ ...listParamsDefault, ...newListFilter, pageIndex: 1 });
  };

  const handleSort = async (option) => {
    setParams({
      ...listParamsDefault,
      sortType: option.title.sortType,
    });
  };

  const [params, setParams] = useState(listParamsDefault);
  const { showNoti } = useWrap();
  const [totalPage, setTotalPage] = useState(null);
  const [packageSetResult, setPackageSetResult] = useState<ISetPackageResult[]>(
    []
  );
  const [isLoading, setIsLoading] = useState({
    type: "GET_ALL",
    status: false,
  });

  const setDataFunc = (name, data) => {
    dataFilter.every((item, index) => {
      if (item.name == name) {
        item.optionList = data;
        return false;
      }
      return true;
    });
    setDataFilter([...dataFilter]);
  };

  const getDataStudent = async () => {
    try {
      let res = await studentApi.getAll({ pageSize: 99999, pageIndex: 1 });
      if (res.status == 200) {
        const newData = res.data.data.map((item) => ({
          title: item.FullNameUnicode,
          value: item.UserInformationID,
        }));
        setDataFunc("StudentID", newData);
      }

      res.status == 204 && showNoti("danger", "Không có dữ liệu học sinh này!");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
    }
  };

  const getDataPackageDetail = async () => {
    try {
      let res = await packageDetailApi.getAll({
        pageSize: 99999,
        pageIndex: 1,
      });
      if (res.status == 200) {
        const newData = res.data.data.map((item) => ({
          title: item.SetPackageName,
          value: item.ID,
        }));
        setDataFunc("SetPackageDetailID", newData);
      }

      res.status == 204 && showNoti("danger", "Không có dữ liệu gói bài này!");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
    }
  };

  useEffect(() => {
    getDataStudent();
    getDataPackageDetail();
  }, []);

  const getPagination = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setParams({
      ...params,
      pageIndex: currentPage,
    });
  };

  const getDataSetPackageResult = (page: any) => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    (async () => {
      try {
        let res = await packageResultApi.getAll({ ...params, pageIndex: page });
        //@ts-ignore
        res.status == 200 && setPackageSetResult(res.data.data);
        if (res.status == 204) {
          showNoti("danger", "Không tìm thấy dữ liệu!");
          setCurrentPage(1);
          setParams(listParamsDefault);
        } else setTotalPage(res.data.totalRow);
      } catch (error) {
        showNoti("danger", error.message);
      } finally {
        setIsLoading({
          type: "GET_ALL",
          status: false,
        });
      }
    })();
  };

  useEffect(() => {
    getDataSetPackageResult(currentPage);
  }, [params]);

  const expandedRowRender = (data, index) => {
    return (
      <Fragment>
        <PackageResultExpand info={data} infoIndex={index} />
      </Fragment>
    );
  };

  return (
    <ExpandTable
      currentPage={currentPage}
      loading={isLoading}
      totalPage={totalPage && totalPage}
      getPagination={(pageNumber: number) => getPagination(pageNumber)}
      addClass="basic-header"
      TitlePage="KẾT QUẢ GÓI BÀI"
      dataSource={packageSetResult}
      columns={columns}
      Extra={
        <div className="extra-table">
          <FilterBase
            dataFilter={dataFilter}
            handleFilter={(listFilter: any) => handleFilter(listFilter)}
            handleReset={handleReset}
          />

          <SortBox
            dataOption={sortOption}
            handleSort={(value) => handleSort(value)}
          />
        </div>
      }
      handleExpand={(data) => setItemDetail(data)}
      expandable={{ expandedRowRender }}
    />
  );
};
PackageSetResult.layout = LayoutBase;
export default PackageSetResult;