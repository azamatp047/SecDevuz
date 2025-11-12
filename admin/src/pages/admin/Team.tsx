// src/pages/Team.tsx
import { useState } from 'react';
import { message, Tabs } from 'antd';
import TeamList from '../../components/team-components/TeamList';
import CertificatesList from '../../components/certificates-components/CertificatesList';

const { TabPane } = Tabs;

const Team = () => {
  const [activeTab, setActiveTab] = useState('teamMembers'); // Qaysi tab faol ekanligini kuzatish uchun state

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    message.success(activeTab);
  };

  return (
    <div className="p-6">
      <Tabs defaultActiveKey="teamMembers" onChange={handleTabChange}>
        <TabPane tab="Team Members" key="teamMembers">
          <TeamList />
        </TabPane>
        <TabPane tab="Certificates" key="certificates">
          <CertificatesList />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Team;
