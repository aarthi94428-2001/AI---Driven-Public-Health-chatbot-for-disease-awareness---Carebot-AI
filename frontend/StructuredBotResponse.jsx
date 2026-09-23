// Frontend/src/components/StructuredBotResponse.jsx
import React from 'react';
import { motion } from 'framer-motion';

const StructuredBotResponse = ({ data }) => {
  if (!data || data.reply) { // Handle non-health related replies or simple error replies
    return <p className="text-gray-800 whitespace-pre-wrap">{data.reply || "An unexpected error occurred."}</p>;
  }

  const renderList = (items) => {
    if (!items || items.length === 0) return null;
    return (
      <ul className="list-disc list-inside ml-4">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-gray-800"
    >
      <h3 className="text-lg font-bold mb-2 text-blue-700">
        {data.disease_name || "Health Information"}
        {data.emergency && <span className="ml-2 text-red-600">🚨 EMERGENCY</span>}
      </h3>
      
      {data.description && (
        <>
          <h4 className="font-semibold mt-3 mb-1 text-blue-600">Description:</h4>
          <p className="text-sm">{data.description}</p>
        </>
      )}

      {data.causes && data.causes.length > 0 && (
        <>
          <h4 className="font-semibold mt-3 mb-1 text-blue-600">Causes:</h4>
          {renderList(data.causes)}
        </>
      )}

      {data.symptoms && data.symptoms.length > 0 && (
        <>
          <h4 className="font-semibold mt-3 mb-1 text-blue-600">Symptoms:</h4>
          {renderList(data.symptoms)}
        </>
      )}

      {data.prevention && data.prevention.length > 0 && (
        <>
          <h4 className="font-semibold mt-3 mb-1 text-blue-600">Prevention:</h4>
          {renderList(data.prevention)}
        </>
      )}

      {data.home_remedies && data.home_remedies !== "N/A" && data.home_remedies.length > 0 && (
        <>
          <h4 className="font-semibold mt-3 mb-1 text-blue-600">Home Remedies:</h4>
          {renderList(data.home_remedies)}
        </>
      )}

      {data.medical_treatments && data.medical_treatments.length > 0 && (
        <>
          <h4 className="font-semibold mt-3 mb-1 text-blue-600">Medical Treatments:</h4>
          {renderList(data.medical_treatments)}
        </>
      )}

      {data.when_to_consult_doctor && (
        <>
          <h4 className="font-semibold mt-3 mb-1 text-blue-600">When to Consult a Doctor:</h4>
          <p className="text-sm">{data.when_to_consult_doctor}</p>
        </>
      )}

      {data.emergency_warning_signs && data.emergency_warning_signs !== "None identified." && data.emergency_warning_signs.length > 0 && (
        <>
          <h4 className="font-semibold mt-3 mb-1 text-red-600">🚨 Emergency Warning Signs:</h4>
          {renderList(data.emergency_warning_signs)}
        </>
      )}
      
      {/* Disclaimer is already part of the description field in the backend prompt */}
    </motion.div>
  );
};

export default StructuredBotResponse;