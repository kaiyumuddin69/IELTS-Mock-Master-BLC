import React from 'react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ReadingLayout } from './ReadingLayout';
import ReadingPart1 from './ReadingPart1';
import ReadingPart2 from './ReadingPart2';
import ReadingPart3 from './ReadingPart3';

export default function ReadingTest() {
  return (
    <MemoryRouter initialEntries={['/reading/part1']}>
      <Routes>
        <Route path="/reading" element={<ReadingLayout />}>
          <Route index element={<Navigate to="part1" replace />} />
          <Route path="part1" element={<ReadingPart1 />} />
          <Route path="part2" element={<ReadingPart2 />} />
          <Route path="part3" element={<ReadingPart3 />} />
        </Route>
        <Route path="*" element={<Navigate to="/reading/part1" replace />} />
      </Routes>
    </MemoryRouter>
  );
}
