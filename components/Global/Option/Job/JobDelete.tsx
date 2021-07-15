import { Tooltip } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useState } from "react";
import { AlertTriangle, X } from "react-feather";
import { jobApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";

const JobDelete = React.memo((props: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { jobId, reloadData } = props;
  const { showNoti } = useWrap();

  const onHandleDelete = async () => {
    try {
      // @ts-ignore
      let res = await jobApi.update({ JobID: jobId, Enable: false });
      showNoti("success", res.data?.message);
      reloadData();
      setIsModalVisible(false);
    } catch (error) {
      showNoti("danger", error.message);
      setIsModalVisible(false);
    }
  };

  return (
    <>
      <Tooltip title="Xóa">
        <button
          className="btn btn-icon delete"
          onClick={() => {
            setIsModalVisible(true);
          }}
        >
          <X />
        </button>
      </Tooltip>
      <Modal
        title={<AlertTriangle color="red" />}
        visible={isModalVisible}
        onOk={onHandleDelete}
        onCancel={() => setIsModalVisible(false)}
      >
        <p className="text-confirm">Bạn có muốn xóa nghề nghiệp này?</p>
      </Modal>
    </>
  );
});

export default JobDelete;
