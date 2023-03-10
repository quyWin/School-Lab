import { Select, Col, Form, Input, Row, Divider, DatePicker, Breadcrumb, message } from "antd";
import React, { useEffect, useState } from "react";
import "./form-create-lesson.scss";
import * as SC from "../../../CustomButton/styled";
import MultipartAPI from "../../../../../util/MultipartFormDataAPI";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Dragger from "antd/lib/upload/Dragger";
import { CloudUploadOutlined } from "@ant-design/icons";
import moment from "moment";
import * as S3 from "../../../../../util/S3Host";
import Loading from "../../../loading";
import TextArea from "antd/lib/input/TextArea";
import { useRef } from "react";
import BaseAPI from "../../../../../util/BaseAPI";
import Ckeditor from "react-ckeditor-component/lib/ckeditor";

const { Option } = Select;

export default function FormEditLesson() {
  const queryString = useLocation().search;
  const lessonId = new URLSearchParams(queryString).get("lessonId");

  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    let lessonResponse = BaseAPI.get(`/lessons/${lessonId}`);
    lessonResponse
      .then((res) => {
        if (res?.status === 200) {
          setLesson(res.data.item);
        } else {
          setLesson(null);
        }
      })
      .catch((err) => {
        setLesson(null);
      });
  }, []);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [context, setContext] = useState(null);
  const [goal, setGoal] = useState(null);
  const [level, setLevel] = useState(1);
  const [endAt, setEndAt] = useState(undefined);

  const [file, setFile] = useState(null);
  const [isValidFile, setIsValidFile] = useState(true);

  const [form] = Form.useForm();

  const titleRef = useRef();
  const scienceRef = useRef();
  const tecnologyRef = useRef();
  const engineeringRef = useRef();
  const mathematicsRef = useRef();
  const preparationRef = useRef();
  const implementationRef = useRef();
  const presentationRef = useRef();
  const productionRef = useRef();

  useEffect(() => {
    if (lesson) {
      form.setFieldsValue({
        title: lesson?.title,
        science: lesson?.science ? lesson?.science.replaceAll("<br/>", "\n") : "",
        technology: lesson?.technology ? lesson?.technology.replaceAll("<br/>", "\n") : "",
        engineering: lesson?.engineering ? lesson?.engineering.replaceAll("<br/>", "\n") : "",
        mathematics: lesson?.mathematics ? lesson?.mathematics.replaceAll("<br/>", "\n") : "",
        preparation: Number(lesson?.preparation || 0),
        implementation: Number(lesson?.implementation || 0),
        presentation: Number(lesson?.presentation || 0),
        production: Number(lesson?.production || 0)
      });
      setContext(lesson.context);
      setGoal(lesson.goal);
      setLevel(lesson.level_id);
      setEndAt(lesson.end_at);
    }
  }, [lesson]);

  const handleContextChange = (e) => {
    setContext(e.editor.getData().trim());
  };

  const handleGoalChange = (e) => {
    setGoal(e.editor.getData().trim());
  };

  const handleLevelChange = (value) => {
    setLevel(value);
  };

  const handleEndAtChange = (value) => {
    setEndAt(value?.unix() || null);
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
      setIsValidFile(false);
      message.error("K??ch th?????c file n??y ???? v?????t qu?? 25MB, kh??ng th??? t???i l??n");
      return false;
    } else {
      setIsValidFile(true);
      return true;
    }
  };

  const onRemove = () => {
    setFile({});
    setIsValidFile(true);
  };

  const props = {
    name: "file",
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

  const onSave = (values) => {
    let totalPercetage =
      parseInt(preparationRef.current.input.value) +
      parseInt(implementationRef.current.input.value) +
      parseInt(presentationRef.current.input.value) +
      parseInt(productionRef.current.input.value);
    if (totalPercetage !== 100) {
      message.error("T???ng c??c ti??u ch?? ph???i b???ng 100");
    } else if (!titleRef.current.input.value?.trim()) {
      message.error("T??n d??? ??n kh??ng ???????c ????? tr???ng");
    } else {
      setLoading(true);
      var formData = new FormData();
      formData.append("title", titleRef.current.input.value);
      formData.append("context", context);
      formData.append("goal", goal);
      formData.append("levelId", level);
      formData.append("endAt", endAt);
      formData.append("science", scienceRef.current.resizableTextArea.textArea.value);
      formData.append("technology", tecnologyRef.current.resizableTextArea.textArea.value);
      formData.append("engineering", engineeringRef.current.resizableTextArea.textArea.value);
      formData.append("mathematics", mathematicsRef.current.resizableTextArea.textArea.value);
      formData.append("preparation", preparationRef.current.input.value);
      formData.append("implementation", implementationRef.current.input.value);
      formData.append("presentation", presentationRef.current.input.value);
      formData.append("production", productionRef.current.input.value);
      formData.append("file", file);
      let updateLessonResponse = MultipartAPI.patch(`/lessons/${lesson?.id}`, formData);

      updateLessonResponse
        .then((res) => {
          if (res?.status === 200) {
            message.success(`C???p nh???t d??? ??n th??nh c??ng`);
            setLoading(false);
            navigate(`/teacher/lessons/detail?lessonId=${lesson?.id}`);
          } else {
            setLoading(false);
            message.error(res?.response?.data?.message || "C?? l???i x???y ra");
          }
        })
        .catch((err) => {
          setLoading(false);
          message.error(err?.response?.data?.message || "C?? l???i x???y ra");
        });
    }
  };

  return (
    <div className="form-create-lab">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={`/teacher/classes/lessons?classId=${lesson?.class_id}`}>{lesson?.class_name}</Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <h2>Ch???nh s???a d??? ??n</h2>
      <Form onFinish={onSave} autoComplete="off" form={form}>
        <Row justify="space-between">
          <Col xs={24} sm={5} md={5} lg={5} xl={5}>
            <h4>M??n h???c</h4>
            <Input type="text" size="large" disabled value={lesson?.subject_name} />
          </Col>
          <Col xs={24} sm={18} md={18} lg={18} xl={18}>
            <h4>Ti??u ????? - T??n d??? ??n</h4>
            <Form.Item
              name="title"
              rules={[
                {
                  required: true,
                  message: "Vui l??ng nh???p t??n d??? ??n"
                },
                {
                  pattern: /.*[A-Za-z0-9].*/,
                  message: "T??n d??? ??n kh??ng ???????c ????? tr???ng"
                }
              ]}
            >
              <Input size="large" ref={titleRef} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="space-between" style={{ marginBottom: 20 }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <Divider orientation="left">Th??ng tin d??? ??n</Divider>
            <h4>L?? do / Hi???n tr???ng</h4>
            <Form.Item name="context">
              <Ckeditor
                activeClass="editor"
                content={context}
                // config={{
                //   toolbarCanCollapse: true,
                //   toolbarStartupExpanded: false
                // }}
                events={{
                  blur: handleContextChange
                }}
              />
            </Form.Item>
            <h4>M???c ti??u ?????t ???????c c???a d??? ??n</h4>
            <Form.Item
            // rules={[
            //   {
            //     required: true,
            //     message: "Vui l??ng nh???p t??n M???c ti??u ?????t ???????c c???a d??? ??n"
            //   }
            // ]}
            >
              <Ckeditor
                activeClass="editor"
                content={goal}
                // config={{
                //   toolbarCanCollapse: true,
                //   toolbarStartupExpanded: false
                // }}
                events={{
                  blur: handleGoalChange
                }}
              />
            </Form.Item>
            <Row justify="space-between">
              <Col xs={24} sm={11} md={11} lg={11} xl={10}>
                <Form.Item name="level">
                  <h4>M???c ????? c???a d??? ??n</h4>
                  <Select size="large" defaultValue={1} value={level} onChange={handleLevelChange}>
                    <Option value={1}>????n gi???n</Option>
                    <Option value={2}>Trung b??nh</Option>
                    <Option value={3}>Ph???c t???p</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={11} md={11} lg={11} xl={10}>
                <Form.Item>
                  <h4>Th???i h???n n???p b??i (T??y ch???n)</h4>
                  <DatePicker
                    showTime={{
                      format: "HH:mm"
                    }}
                    size="large"
                    format={"DD-MM-yyyy HH:mm"}
                    onChange={handleEndAtChange}
                    value={endAt ? moment.unix(endAt) : null}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left">T???p ????nh k??m</Divider>
            <Row>
              {lesson?.attachment_url && (
                <a className="attachment" target={"_blank"} href={`${S3.HOST}${lesson?.attachment_url}`}>
                  {lesson?.attachment_url?.substring(`lessons/${lesson?.id}/`.length)}
                </a>
              )}
            </Row>
            T???i l??n v?? ghi ???? t???p ????nh k??m ???? c??
            <Dragger maxCount={1} {...props} style={{ width: "100%" }}>
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined />
              </p>
              <p className="ant-upload-text">Ch???n ho???c k??o th??? file v??o ????y ????? t???i l??n</p>
              <p className="ant-upload-hint warning">
                N???u c?? nhi???u h??n 1 t???p c???n n???p, h??y n??n t???t c??? l???i nh??
                <br />
                Vui l??ng t???i l??n file c?? k??ch th?????c nh??? h??n 25MB
              </p>
            </Dragger>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={11}>
            <Divider orientation="left">Ki???n th???c STEM</Divider>
            <h4>Khoa h???c (S - Science)</h4>
            <Form.Item name="science">
              <TextArea rows={4} ref={scienceRef} />
            </Form.Item>
            <h4>C??ng ngh??? (T - Technology)</h4>
            <Form.Item name="technology">
              <TextArea rows={4} ref={tecnologyRef} />
            </Form.Item>
            <h4>K??? thu???t (E - Engineering)</h4>
            <Form.Item name="engineering">
              <TextArea rows={4} ref={engineeringRef} />
            </Form.Item>
            <h4>To??n h???c (M - Mathematics)</h4>
            <Form.Item name="mathematics">
              <TextArea rows={4} ref={mathematicsRef} />
            </Form.Item>
            <Divider orientation="left">Ti??u ch?? ????nh gi?? ??i???m</Divider>
            <Row justify="space-between">
              <Col span={11}>
                <h4>Giai ??o???n chu???n b??? (%)</h4>
                <Form.Item
                  name="preparation"
                  rules={[
                    {
                      required: true,
                      message: "Vui l??ng nh???p d??? li???u"
                    }
                  ]}
                >
                  <Input type="number" min={0} max={100} size="large" ref={preparationRef} />
                </Form.Item>
                <h4>Giai ??o???n th???c hi???n (%)</h4>
                <Form.Item
                  name="implementation"
                  rules={[
                    {
                      required: true,
                      message: "Vui l??ng nh???p d??? li???u"
                    }
                  ]}
                >
                  <Input type="number" min={0} max={100} size="large" ref={implementationRef} />
                </Form.Item>
              </Col>
              <Col span={11}>
                <h4>Thuy???t tr??nh (%)</h4>
                <Form.Item
                  name="presentation"
                  rules={[
                    {
                      required: true,
                      message: "Vui l??ng nh???p d??? li???u"
                    }
                  ]}
                >
                  <Input type="number" min={0} max={100} size="large" ref={presentationRef} />
                </Form.Item>
                <h4>S???n ph???m (%)</h4>
                <Form.Item
                  name="production"
                  rules={[
                    {
                      required: true,
                      message: "Vui l??ng nh???p d??? li???u"
                    }
                  ]}
                >
                  <Input type="number" min={0} max={100} size="large" ref={productionRef} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={[10, 10]} justify="start" align="middle">
          <Col>
            <Form.Item>
              <SC.btnCancel onClick={() => navigate(-1)}>H???y b???</SC.btnCancel>
            </Form.Item>
          </Col>
          {isValidFile ? (
            <Col>
              <Form.Item>
                {loading ? <Loading /> : <SC.btnLightGreen type="submit">C???p nh???t</SC.btnLightGreen>}
              </Form.Item>
            </Col>
          ) : (
            <Col style={{ color: "red", fontStyle: "italic" }}>
              K??ch th?????c file n??y ???? v?????t qu?? 25MB, kh??ng th??? t???i l??n
            </Col>
          )}
        </Row>
      </Form>
    </div>
  );
}
