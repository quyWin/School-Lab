import React, { useState } from "react";
import LayoutHomeList from "../../components/layouts/mainLayout";
import * as SC from "../../components/common/CustomButton/styled";
import { Col, DatePicker, Form, message, Row, Select, Typography } from "antd";
import BaseAPI from "../../util/BaseAPI";
import { useEffect } from "react";
import OwnerRequests from "../../components/common/table/table-admin/owner-requests";

const { Option } = Select;
const { Title } = Typography;
const { RangePicker } = DatePicker;

export default function Requests() {
  const [supports, setSupports] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const [priority, setPriority] = useState("ALL");
  const [sort, setSort] = useState("DESC");
  const [createAtFrom, setCreateAtFrom] = useState(null);
  const [createAtTo, setCreateAtTo] = useState(null);
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);

  const handlePageChange = (value) => {
    setPage(value);
  };

  const handlePriorityChange = (value) => {
    setPriority(value);
  };

  const handleSortChange = (value) => {
    setSort(value);
  };

  const handleCreateAtSearchChange = (value) => {
    let createAtFrom = null;
    let createAtTo = null;
    try {
      createAtFrom = value[0].unix() || null;
    } catch (error) {}
    try {
      createAtTo = value[1].unix() || null;
    } catch (error) {}

    setCreateAtFrom(createAtFrom);
    setCreateAtTo(createAtTo);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const getSupports = () => {
    let response = BaseAPI.get(`/supports/owner`, {
      params: {
        priority: priority === "ALL" ? null : priority,
        status: status === "ALL" ? null : status,
        create_at_from: createAtFrom,
        create_at_to: createAtTo,
        type_sort: sort,
        page: page
      }
    });
    response
      .then((res) => {
        if (res?.status === 200) {
          setSupports(res.data.items);
          setTotalItems(res.data.total_items);
        } else {
          setSupports([]);
          setTotalItems(0);
          message.error(res?.response?.data?.message || "C?? l???i x???y ra");
        }
      })
      .catch((err) => {
        setSupports([]);
        setTotalItems(0);
        message.error(err?.response?.data?.message || "C?? l???i x???y ra");
      });
  };

  useEffect(() => {
    getSupports();
  }, []);

  document.title = "Danh s??ch y??u c???u ???? g???i";
  return (
    <LayoutHomeList
      content={
        <div className="admin-list-support">
          <Title level={2}>Danh s??ch y??u c???u h??? tr??? ???? g???i</Title>
          <div className="filter-ad-list-support">
            <Form onFinish={getSupports}>
              <Row gutter={[10, 10]} justify="start" align="bottom">
                <Col xxl={2} xl={4} lg={5} md={8} sm={12} xs={24}>
                  <label>M???c ?????</label>
                  <Form.Item>
                    <Select defaultValue={"ALL"} size="large" onChange={handlePriorityChange}>
                      <Option value="ALL">T???t c???</Option>
                      <Option value="LOW">Th???p</Option>
                      <Option value="MEDIUM">Trung b??nh</Option>
                      <Option value="HIGH">Nghi??m tr???ng</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xxl={2} xl={4} lg={5} md={8} sm={12} xs={24}>
                  <label>Tr???ng th??i</label>
                  <Form.Item>
                    <Select defaultValue={"ALL"} size="large" onChange={handleStatusChange}>
                      <Option value="ALL">T???t c???</Option>
                      <Option value="DONE">???? x??? l??</Option>
                      <Option value="WAITTING">Ch??? x??? l??</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xxl={2} xl={4} lg={5} md={8} sm={12} xs={24}>
                  <label>S???p x???p theo</label>
                  <Form.Item>
                    <Select defaultValue={"DESC"} size="large" onChange={handleSortChange}>
                      <Option value={"ASC"}>C?? nh???t</Option>
                      <Option value={"DESC"}>M???i nh???t</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xl={5} lg={5} md={8} sm={12} xs={24}>
                  <label>Th???i gian</label>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Vui l??ng ch???n th???i gian"
                      }
                    ]}
                  >
                    <RangePicker size="large" onChange={handleCreateAtSearchChange} />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item>
                    <SC.btnWhite>T??m ki???m</SC.btnWhite>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <OwnerRequests
            supports={supports}
            refresh={getSupports}
            totalItems={totalItems}
            handlePageChange={handlePageChange}
          />
        </div>
      }
    />
  );
}
