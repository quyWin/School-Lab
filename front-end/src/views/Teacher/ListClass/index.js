import React, { useEffect, useState } from "react";
import { Form, Input, Select, Typography } from "antd";
import ClassesTeacher from "../../../components/common/Card/card-teacher";
import * as SC from "../../../components/common/CustomButton/styled";
import LayoutHomeList from "../../../components/layouts/mainLayout";
import { Link } from "react-router-dom";
import { Row, Col } from "antd";
import { useSelector } from "react-redux";
import { semestersSelector, userInfoSelector } from "../../../redux/selector";
import BaseAPI from "../../../util/BaseAPI";
import "./style.scss";

const { Title } = Typography;
const { Option } = Select;

export default function TeacherListClass() {
  const user = useSelector(userInfoSelector);

  const [classes, setClasses] = useState([]);
  const [gradeId, setGradeId] = useState(0);
  const [className, setClassName] = useState("");
  const [formTeacher, setFormTeacher] = useState("");

  const semesters = useSelector(semestersSelector);
  const [semesterId, setSemesterId] = useState(semesters[0]?.id || undefined);

  useEffect(() => {
    if (semesterId) {
      getClasses();
    }
  }, []);

  const getClasses = () => {
    const response = BaseAPI.get(`/classes/teacher`, {
      params: {
        semester_id: semesterId,
        grade_id: gradeId === 0 ? null : gradeId,
        class_name: className.length === 0 ? null : className,
        form_teacher: formTeacher.length === 0 ? null : formTeacher
      }
    });
    response
      .then((res) => {
        if (res?.status === 200) {
          setClasses(res.data.items);
        }
      })
      .catch((err) => {
        setClasses([]);
      });
  };

  const onFilter = () => {
    getClasses();
  };

  useEffect(() => {
    if (semesterId) {
      getClasses();
    }
  }, [semesterId]);

  const handleSemesterChange = (value) => {
    setSemesterId(value);
  };

  const handleClassNameChange = (e) => {
    setClassName(e.target.value.trim());
  };

  const handleFormTeacherChange = (e) => {
    setFormTeacher(e.target.value.trim());
  };

  const handleGradeChange = (value) => {
    setGradeId(value);
  };

  return (
    <LayoutHomeList
      content={
        <div className="classes-wrapper">
          <Title level={3} style={{ textAlign: "left", margin: "20px 0" }}>
            <span>
              <i className="fas fa-school"></i> {user.campus_name}
            </span>
            <br />
            Gi??o vi??n:{" "}
            <span>
              {user.id} {" - "}
              {user.first_name} {user.last_name}
            </span>
          </Title>
          <div className="filter">
            <Form onFinish={onFilter}>
              <Row gutter={[10, 10]} justify="start" align="bottom">
                <Col xl={5} lg={12} md={12} sm={12} xs={24}>
                  <label>H???c k???</label>
                  <Form.Item>
                    <Select
                      defaultValue={semesterId}
                      size="large"
                      onChange={handleSemesterChange}
                      placeholder="Ch???n h???c k???"
                    >
                      {semesters.map((item) => {
                        return (
                          <Option key={item.id} value={item.id}>
                            {item.name} - {item.year}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={2}>
                  <label>Kh???i</label>
                  <Form.Item>
                    <Select defaultValue="T???t c???" size="large" onChange={handleGradeChange}>
                      <Option key={0} value={0}>
                        T???t c???
                      </Option>
                      <Option key={1} value={1}>
                        Kh???i 10
                      </Option>
                      <Option key={2} value={2}>
                        Kh???i 11
                      </Option>
                      <Option key={3} value={3}>
                        Kh???i 12
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                  <label>T??n l???p</label>
                  <Form.Item>
                    <Input size="large" onChange={handleClassNameChange} value={className} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                  <label>GV Ch??? nhi???m</label>
                  <Form.Item>
                    <Input size="large" onChange={handleFormTeacherChange} value={formTeacher} />
                  </Form.Item>
                </Col>
                <Col className="group-btn">
                  <Form.Item>
                    <SC.btnWhite>T??m ki???m</SC.btnWhite>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <ClassesTeacher classes={classes} />
        </div>
      }
    />
  );
}
