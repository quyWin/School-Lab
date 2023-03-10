import { Checkbox, Col, Collapse, Drawer, Form, InputNumber, List, message, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import BaseAPI from "../../../util/BaseAPI";
import SkeletonApp from "../../common/Skeleton";
import * as SC from "../../common/CustomButton/styled";
import Dragger from "antd/lib/upload/Dragger";
import { CloudUploadOutlined, ReloadOutlined } from "@ant-design/icons";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../common/loading";
import groupSlice, { random, order, createTemplate, template } from "../../../redux/slices/groupSlice";

const { Panel } = Collapse;
const { Title } = Typography;

export default function TeacherClassGroup({ classId, lessonId, lessonStatus }) {
  const dispatch = useDispatch();

  const [classGroups, setClassGroups] = useState(null);
  const [override, setOverride] = useState(false);

  const loading = useSelector((state) => state.group.loading);
  const responseMessage = useSelector((state) => state.group.message);
  const messageType = useSelector((state) => state.group.messageType);

  const [openRandomGroup, setOpenRandomGroup] = useState(false);
  const [openOrderGroup, setOpenOrderGroup] = useState(false);
  const [openTemplateGroup, setOpenTemplateGroup] = useState(false);

  //template
  const templateLoading = useSelector((state) => state.group.createTemplate.loading);
  const templateLink = useSelector((state) => state.group.createTemplate.templateLink);
  const templateMeassge = useSelector((state) => state.group.createTemplate.message);
  const templateStatus = useSelector((state) => state.group.createTemplate.templateStatus);

  const [numberOfGroup, setNumberOfGroup] = useState(2);

  const [file, setFile] = useState({});

  useEffect(() => {
    if (responseMessage && messageType) {
      if (messageType === "SUCCESS") {
        message.success(responseMessage);
        getClassGroup();
      } else {
        message.error(responseMessage);
      }
      dispatch(groupSlice.actions.resetState());
    }
  }, [responseMessage, messageType]);

  useEffect(() => {
    getClassGroup();
  }, []);

  const getClassGroup = () => {
    let response = BaseAPI.get(`/class-groups/${classId}/${lessonId}`);
    response
      .then((res) => {
        if (res?.status === 200) {
          setClassGroups(res.data.items);
        }
      })
      .catch((err) => {
        setClassGroups(null);
      });
  };

  const handleOverrideChange = (checked) => {
    setOverride(checked.target.checked);
  };

  const onOpenRandowGroup = () => {
    setOpenRandomGroup(true);
  };
  const onOpenOrderGroup = () => {
    setOpenOrderGroup(true);
  };
  const onOpenTemplateGroup = () => {
    setOpenTemplateGroup(true);
  };

  const onCloseRandowGroup = () => {
    setOpenRandomGroup(false);
  };
  const onCloseOrderGroup = () => {
    setOpenOrderGroup(false);
  };
  const onCloseTemplateGroup = () => {
    setOpenTemplateGroup(false);
  };

  const handleNumberOfGroup = (value) => {
    setNumberOfGroup(value);
  };

  const sendRequestRandomGroup = () => {
    dispatch(
      random({
        classId: classId,
        lessonId: lessonId,
        numberOfGroup: numberOfGroup,
        override: override
      })
    );
  };

  const sendRequestOpenGroup = () => {
    dispatch(
      order({
        classId: classId,
        lessonId: lessonId,
        numberOfGroup: numberOfGroup,
        override: override
      })
    );
  };

  const sendRequestCreateTemplate = () => {
    dispatch(
      createTemplate({
        classId: classId
      })
    );
  };

  const sendRequestTemplateGroup = () => {
    dispatch(
      template({
        classId: classId,
        lessonId: lessonId,
        file: file
      })
    );
  };

  const dummyRequest = ({ file, onSuccess, onFailure }) => {
    setTimeout(() => {
      setFile(file);
      onSuccess("ok");
    }, 2000);
  };

  const beforeUpload = (file) => {
    if (file.size > 25000000) {
      setFile({});
      message.error("K??ch th?????c file n??y ???? v?????t qu?? 25MB, kh??ng th??? t???i l??n");
      return false;
    } else {
      return true;
    }
  };

  const onRemove = () => {
    setFile({});
  };

  const props = {
    name: "file",
    accept: ".xlsx",
    multiple: false,
    customRequest: dummyRequest,
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        message.success(`T???i l??n th??nh c??ng file ${info.file.name}`);
      } else if (status === "error") {
        message.error(`${info.file.name} t???i l??n th???t b???i.`);
      }
    },
    beforeUpload: beforeUpload,
    onRemove: onRemove,
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068"
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`
    }
  };

  return (
    <SkeletonApp
      content={
        <>
          {lessonStatus === "ONGOING" && (
            <>
              <Title level={4}>Chia nh??m</Title>
              <Checkbox checked={override} onChange={handleOverrideChange}>
                Ghi ???? nh??m ???? c??
              </Checkbox>
              <Row gutter={[10, 10]} align="middle" style={{ marginBottom: 30, marginTop: 20 }}>
                <Col>
                  <SC.btnWhite onClick={getClassGroup}>
                    <ReloadOutlined />
                  </SC.btnWhite>
                </Col>
                <Col>
                  <SC.btnWhite onClick={onOpenRandowGroup}>Ng???u nhi??n</SC.btnWhite>
                </Col>
                <Col>
                  <SC.btnGreenLight onClick={onOpenOrderGroup}>Theo th??? t???</SC.btnGreenLight>
                </Col>
                <Col>
                  <SC.btnLightGreen onClick={onOpenTemplateGroup}>Theo m???u</SC.btnLightGreen>
                </Col>
                <Drawer
                  title="Chia nh??m ng???u nhi??n"
                  placement="right"
                  onClose={onCloseRandowGroup}
                  open={openRandomGroup}
                >
                  <Form>
                    <h4>S??? nh??m c???n t???o:</h4>
                    <Form.Item name="numberOfGroup">
                      <InputNumber
                        style={{ width: "100%" }}
                        size="large"
                        min={2}
                        defaultValue={numberOfGroup}
                        onChange={handleNumberOfGroup}
                      />
                    </Form.Item>
                  </Form>
                  {loading ? <Loading /> : <SC.btnBlue onClick={sendRequestRandomGroup}>T???o</SC.btnBlue>}
                </Drawer>
                <Drawer
                  title="Chia nh??m theo th??? t??? danh s??nh"
                  placement="right"
                  onClose={onCloseOrderGroup}
                  open={openOrderGroup}
                >
                  <Form>
                    <h4>S??? nh??m c???n t???o:</h4>
                    <Form.Item name="numberOfGroup">
                      <InputNumber
                        style={{ width: "100%" }}
                        size="large"
                        min={2}
                        defaultValue={numberOfGroup}
                        onChange={handleNumberOfGroup}
                      />
                    </Form.Item>
                  </Form>
                  {loading ? <Loading /> : <SC.btnBlue onClick={sendRequestOpenGroup}>T???o</SC.btnBlue>}
                </Drawer>
                <Drawer
                  title="Chia nh??m theo m???u"
                  placement="right"
                  size="large"
                  onClose={onCloseTemplateGroup}
                  open={openTemplateGroup}
                >
                  <Title level={5} style={{ color: "red", fontStyle: "italic" }}>
                    T???o theo m???u s??? t??? ?????ng ghi ???? nh??m ???? c??
                  </Title>
                  <Dragger maxCount={1} {...props} style={{ width: "100%", height: "300px" }}>
                    <p className="ant-upload-drag-icon">
                      <CloudUploadOutlined />
                    </p>
                    <p className="ant-upload-text">Ch???n ho???c k??o th??? file v??o ????y ????? t???i l??n</p>
                    <br />
                    <h4>N???u ch??a c?? m???u, vui l??ng t???o v?? t???i m???u ??? link b??n d?????i v??? v?? ??i???n v??o m???u</h4>
                  </Dragger>
                  {!templateLink ? (
                    templateLoading ? (
                      <Row>
                        <Loading />
                      </Row>
                    ) : (
                      <Title level={4} className="create-template" onClick={sendRequestCreateTemplate}>
                        T???o m???u danh s??ch nh??m
                      </Title>
                    )
                  ) : (
                    <Row align="top">
                      <Title level={5} style={{ marginRight: 20 }}>
                        {templateMeassge}
                      </Title>
                      {templateStatus && <a href={templateLink}>T???i xu???ng</a>}
                    </Row>
                  )}

                  {loading ? (
                    <Loading />
                  ) : (
                    <SC.btnWhite style={{ marginTop: 20 }} onClick={sendRequestTemplateGroup}>
                      T???o
                    </SC.btnWhite>
                  )}
                </Drawer>
              </Row>
            </>
          )}
          {classGroups?.length > 0 ? (
            <>
              <Title level={4}>Danh s??ch nh??m</Title>
              <SkeletonApp
                content={
                  <Collapse>
                    {classGroups.map((group) => {
                      return (
                        <Panel key={group.id} header={group.name}>
                          <List
                            size="small"
                            itemLayout="horizontal"
                            dataSource={group.members}
                            renderItem={(item) => (
                              <List.Item>
                                <List.Item.Meta title={item.member_name} description={item.member_id} />
                              </List.Item>
                            )}
                          />
                        </Panel>
                      );
                    })}
                  </Collapse>
                }
              />
            </>
          ) : (
            <Row style={{ color: "blue" }}>D??? ??n n??y ch??a ???????c chia nh??m</Row>
          )}
        </>
      }
    />
  );
}
