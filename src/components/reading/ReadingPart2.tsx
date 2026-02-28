import { useState } from 'react';
import { Info, MoveHorizontal } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

const ItemTypes = {
  HEADING: 'heading',
};

interface HeadingItem {
  id: string;
  text: string;
}

interface DraggableHeadingProps {
  heading: HeadingItem;
  isUsed: boolean;
}

function DraggableHeading({ heading, isUsed }: DraggableHeadingProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.HEADING,
    item: { id: heading.id, text: heading.text },
    canDrag: !isUsed,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={(el) => { drag(el); }}
      className={`p-3 border border-gray-300 ${
        isUsed
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-white hover:bg-gray-50 cursor-move'
      } ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      {heading.text}
    </div>
  );
}

interface DropZoneProps {
  questionId: string;
  value: string | null;
  onDrop: (questionId: string, headingText: string) => void;
  isInPassage?: boolean;
}

function DropZone({ questionId, value, onDrop, isInPassage = false }: DropZoneProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.HEADING,
    drop: (item: { id: string; text: string }) => {
      onDrop(questionId, item.text);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  if (isInPassage) {
    return (
      <div
        ref={(el) => { drop(el); }}
        className={`border-2 border-dashed ${
          isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-400 bg-white'
        } p-3 min-h-[60px] flex items-center`}
      >
        {value ? (
          <div className="w-full p-2 border border-red-500 bg-white">
            {value}
          </div>
        ) : (
          <span className="text-gray-400 text-sm">{questionId}</span>
        )}
      </div>
    );
  }

  return (
    <div
      ref={(el) => { drop(el); }}
      className={`flex-1 px-3 py-2 border-2 ${
        isOver ? 'border-blue-500 bg-blue-50' : 'border-blue-500 bg-white'
      }`}
    >
      {value || ''}
    </div>
  );
}

function ReadingPart2Content() {
  const [answers, setAnswers] = useState<{ [key: string]: string | string[] }>({});

  const headings: HeadingItem[] = [
    { id: 'h1', text: 'How a maths experiment actually reduced traffic congestion' },
    { id: 'h2', text: 'How a concept from one field of study was applied in another' },
    { id: 'h3', text: 'A lack of investment in driver training' },
    { id: 'h4', text: 'Areas of doubt and disagreement between experts' },
    { id: 'h5', text: 'How different countries have dealt with traffic congestion' },
    { id: 'h6', text: 'The impact of driver behavior on traffic speed' },
    { id: 'h7', text: 'A proposal to take control away from the driver' },
  ];

  const handleHeadingDrop = (questionId: string, headingText: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: headingText }));
  };

  const handleCheckboxChange = (questionId: string, value: string, checked: boolean) => {
    setAnswers(prev => {
      const current = (prev[questionId] as string[]) || [];
      
      // Determine max selections based on question ID
      let maxSelections = 2; // default for "Choose TWO"
      if (questionId === '22-23') {
        maxSelections = 2;
      }
      
      if (checked) {
        // Don't allow more than max selections
        if (current.length >= maxSelections) {
          return prev;
        }
        return { ...prev, [questionId]: [...current, value] };
      } else {
        return { ...prev, [questionId]: current.filter(v => v !== value) };
      }
    });
  };

  const handleInputChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const usedHeadings = new Set([
    answers['14'],
    answers['15'],
    answers['16'],
    answers['17'],
  ].filter(Boolean) as string[]);

  return (
    <div className="h-full flex flex-col">
      {/* Part Header */}
      <div className="bg-gray-100 border-b border-gray-300 px-6 py-3">
        <h2 className="font-bold">Part 2</h2>
        <p className="text-sm">Read the text and answer questions 14–26</p>
      </div>

      {/* Split View */}
      <div className="flex-1 flex overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Left: Reading Passage */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full overflow-y-auto p-6 ielts-scrollbar">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">The Physics of Traffic Behavior</h2>
                <button className="flex items-center gap-2 text-blue-600 text-sm">
                  <Info className="w-4 h-4" />
                  Help
                </button>
              </div>

              {/* Section 14 */}
              <div className="mb-6">
                <DropZone
                  questionId="14"
                  value={answers['14'] as string || null}
                  onDrop={handleHeadingDrop}
                  isInPassage={true}
                />
              </div>
              
              <p className="mb-4">
                Some years ago, when several theoretical physicists, principally Dirk Helbing and Boris Kerner of Stuttgart, Germany began publishing papers on traffic flow in publications normally read by traffic engineers, they were clearly working outside their area of expertise. However, their results were so unexpected, and different in kind from those of traditional traffic engineering, that they were able to obtain considerable research funding from several sources. Of course, vehicles do not behave exactly like gas molecules: for example, drivers try to avoid collisions by slowing down when they get too near another vehicle, whereas gas molecules have no such concern. However, the traffic flow equations appear to work quite well, and so their predictions are qualitatively reliable, provided the deviations from the averages and the overall description of traffic as a flowing gas has proved to be a very successful model, and it has led to several important and interesting predictions.
              </p>

              <p className="mb-4">
                The strangest thing that came out of these equations, however, was the implication that congestion can arise completely spontaneously; no external causes are necessarily needed. Vehicles can be flowing freely along, at a density still well below what the road can handle, and then suddenly pile into a slow-moving ooze. Under the right conditions a small perturbation can grow into a system-wide breakdown that persists for hours. In fact, the physicists' analysis suggested that this is an example of what is known as a 'phase transition', in which small changes can have huge effects – just as when water is heated to 100°C, a small increase in temperature can trigger a system-wide transition from vapor to liquid finally occurs. Helbing and Kerner see traffic as a complex interacting system. They note that in fluid dynamics also, such transitions are commonplace when systems enter or leave different regimes of fluid flow, for instance when flow transitions from a benign and highly turbulent state.
              </p>

              {/* Section 15 */}
              <h3 className="font-bold mt-6 mb-4">Dramatic effects can result from small changes in traffic just as in nature</h3>

              <div className="mb-6">
                <DropZone
                  questionId="15"
                  value={answers['15'] as string || null}
                  onDrop={handleHeadingDrop}
                  isInPassage={true}
                />
              </div>

              <p className="mb-4">
                Though a decidedly unsettling discovery, this showed striking similarities to the phenomena popularized as 'chaos theory'. This theory has arisen from the finding that in many physical systems with interacting parts, even in absolutely deterministic systems where the basic principles such as Newton's laws of motion apply perfectly, and in which everything should be entirely predictable, the actual behavior is totally unpredictable. As systems grow more and more complex, it is easy to predict whether they will be in the vicinity of a liquid or vaporous or solid state. However, after its temperature and density have reached the point where it could condense into water droplets, the exact timing of such phase condensation can take place and crystallization can occur almost without warning, whether this happens at liquid water drop boundary, a phase transition from vapor to liquid finally occurs. Helbing and Kerner see traffic as a complex interacting system. They note in the flow of traffic could ultimately require implementing the radical idea that has been suggested from time to time directly regulating the speed and spacing of individual cars along a highway with central computers and sensors that communicate with each car's engine and brake controls.
              </p>

              <div className="border-t-2 border-gray-300 my-6"></div>

              {/* Section 16 */}
              <div className="mb-6">
                <DropZone
                  questionId="16"
                  value={answers['16'] as string || null}
                  onDrop={handleHeadingDrop}
                  isInPassage={true}
                />
              </div>

              <p className="mb-4">
                James Banks, a professor of civil and environmental engineering at San Diego State University in the US, suggested that a sudden slowdown in traffic may have less to do with chaos theory than with driver psychology. As traffic gets heavier and the passing lane gets more crowded, aggressive drivers switch to other lanes to try to pass, which also tends to even out the speed between lanes. He also felt that another leveling force is that when a driver in a fast lane brakes a little to maintain a safe distance between vehicles, the shock wave travels back much more rapidly than it would in the other slower lanes, because each following driver has to react more quickly. Consequently as a road becomes congested, the faster moving traffic is the first to slow down.
              </p>

              {/* Section 17 */}
              <div className="mb-6">
                <DropZone
                  questionId="17"
                  value={answers['17'] as string || null}
                  onDrop={handleHeadingDrop}
                  isInPassage={true}
                />
              </div>

              <p className="mb-4">
                However, research into traffic control is generally centered in civil engineering departments and here the theories of the physicists have met a practical approach to problems, and below traffic congestion is the result of poor road construction (two lanes becoming one lane or dangerous curves), which contribute to erratic results. Traffic engineers questioned how the physicists' theoretical results relate to traffic in the real world. Indeed, some engineering researchers questioned whether elaborate chaos theory interpretations are needed at all. After all, roads are not always built perfectly: some have poor design and construction, which may need improvement; others may have unusual observations that had been appearing in traffic engineering literature under other names for years; observations, which most engineers had assumed would by now be basically understood within the context of conventional traffic theory.
              </p>
            </div>
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle className="relative w-2 bg-gray-300 hover:bg-gray-400 transition-colors group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-400 group-hover:bg-gray-500 border border-gray-500 flex items-center justify-center cursor-col-resize shadow-sm z-10">
              <MoveHorizontal className="w-4 h-4 text-white" />
            </div>
          </PanelResizeHandle>

          {/* Right: Questions */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full overflow-y-auto p-6 bg-gray-50 ielts-scrollbar">
              {/* Questions 14-17 */}
              <div className="mb-8">
                <h3 className="font-bold mb-3">Questions 14–17</h3>
                <p className="mb-4">
                  The text has four sections. Choose the correct heading for each section and move it into the gap.
                </p>

                <div className="bg-white border border-gray-300 p-4 mb-4">
                  <h4 className="font-bold mb-3">List of Headings</h4>
                  <div className="space-y-2">
                    {headings.map((heading) => (
                      <DraggableHeading
                        key={heading.id}
                        heading={heading}
                        isUsed={usedHeadings.has(heading.text)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Questions 18-23 */}
              <div className="mb-8">
                <h3 className="font-bold mb-3">Questions 18–23</h3>
                <p className="mb-4">Choose <strong>TWO</strong> correct answers.</p>

                <div className="space-y-6">
                  <div className="bg-white border border-gray-300 p-4">
                    <div className="mb-3">
                      <span className="font-bold">18–19</span> Which <strong>TWO</strong> options describe what the writer is doing in section two?
                    </div>
                    <div className="space-y-2">
                      {[
                        { value: 'explaining', text: "explaining Helbing and Kerner's attitude to chaos theory" },
                        { value: 'clarifying', text: "clarifying Helbing and Kerner's conclusions about traffic behaviour" },
                        { value: 'showing', text: 'showing how weather and temperature can change traffic flow' },
                        { value: 'drawing', text: 'drawing parallels between the behaviour of clouds and traffic' },
                        { value: 'giving', text: 'giving examples of different potential causes of congestion' },
                      ].map((option) => (
                        <label key={option.value} className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={((answers['18-19'] as string[]) || []).includes(option.value)}
                            onChange={(e) => handleCheckboxChange('18-19', option.value, e.target.checked)}
                            className="w-4 h-4 mt-1"
                          />
                          <span className="flex-1">{option.text}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-300 p-4">
                    <div className="mb-3">
                      <span className="font-bold">20–21</span> Which <strong>TWO</strong> statements reflect civil engineers' opinions of the physicists' theories?
                    </div>
                    <div className="space-y-2">
                      {[
                        { value: 'fail', text: 'They fail to take into account road maintenance.' },
                        { value: 'have-little', text: 'They may have little to do with everyday traffic behaviour.' },
                        { value: 'inconsistent', text: 'They are inconsistent with chaos theory.' },
                        { value: 'do-not', text: 'They do not really describe anything new.' },
                        { value: 'disproved', text: 'They can easily be disproved.' },
                      ].map((option) => (
                        <label key={option.value} className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={((answers['20-21'] as string[]) || []).includes(option.value)}
                            onChange={(e) => handleCheckboxChange('20-21', option.value, e.target.checked)}
                            className="w-4 h-4 mt-1"
                          />
                          <span className="flex-1">{option.text}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-300 p-4">
                    <div className="mb-3">
                      <span className="font-bold">22–23</span> Which <strong>TWO</strong> of the following options express the purpose of the text?
                    </div>
                    <div className="space-y-2">
                      {[
                        { value: 'change', text: 'To change the behaviour of vehicle drivers' },
                        { value: 'compare', text: 'To compare different approaches to understanding congestion' },
                        { value: 'persuade', text: 'To persuade planners to make the roads straighter' },
                      ].map((option) => (
                        <label key={option.value} className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={((answers['22-23'] as string[]) || []).includes(option.value)}
                            onChange={(e) => handleCheckboxChange('22-23', option.value, e.target.checked)}
                            className="w-4 h-4 mt-1"
                          />
                          <span className="flex-1">{option.text}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions 24-26 */}
              <div className="mb-8">
                <h3 className="font-bold mb-3">Questions 24–26</h3>
                <p className="mb-4">
                  Complete the summary. Write <strong>ONE WORD ONLY</strong> from the text for each answer.
                </p>

                <div className="bg-white border border-gray-300 p-4">
                  <h4 className="font-bold mb-4">Physicists' theories on gas molecules and traffic flow</h4>
                  <div className="space-y-3">
                    <p className="flex items-center gap-2 flex-wrap">
                      <span>Using simulations based on</span>
                      <input
                        type="text"
                        value={answers['24'] as string || ''}
                        onChange={(e) => handleInputChange('24', e.target.value)}
                        className="w-32 px-2 py-1 border-2 border-blue-500 bg-white text-center"
                        placeholder="24"
                      />
                      <span>more commonly used to illustrate the movement of molecules in a gas, physicists have been able to show certain unexpected patterns between the ways gas molecules and traffic behave. They are not similar in all aspects – gas molecules randomly crash into one another and drivers prevent</span>
                      <input
                        type="text"
                        value={answers['25'] as string || ''}
                        onChange={(e) => handleInputChange('25', e.target.value)}
                        className="w-32 px-2 py-1 border-2 border-blue-500 bg-white text-center"
                        placeholder="25"
                      />
                      <span>from happening by altering their speed. The physicists' investigations seemed to show that congestion can occur even when traffic is moving without problem and when no</span>
                      <input
                        type="text"
                        value={answers['26'] as string || ''}
                        onChange={(e) => handleInputChange('26', e.target.value)}
                        className="w-32 px-2 py-1 border-2 border-blue-500 bg-white text-center"
                        placeholder="26"
                      />
                      <span>is within approved levels for the road. Switching cars simple as a slight variation in the flow is all that the cars are travelling or the distance separating them can lead to lengthy traffic flow problems.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default function ReadingPart2() {
  return (
    <DndProvider backend={HTML5Backend}>
      <ReadingPart2Content />
    </DndProvider>
  );
}
